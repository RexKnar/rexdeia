import { calculatePercentage } from 'app/api/analytics/master/comparison/service';
import { getStaffWiseMarkAnalytics } from 'app/api/analytics/master/comparison/staff/service';
import { getStudentMarksByFilter } from 'app/api/analytics/service';
import { normalizeDate } from 'app/api/timetable/shared';
import { getStaffAttendanceForDate } from 'app/api/timetable/staff-attendance/service';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { AttendanceStatus } from 'lib/domain/timetable';
import { getServerSession } from 'next-auth';

export type ExamSummary = {
  id: string;
  name: string;
  totalStudents: number;
  passCount: number;
  failCount: number;
  absentCount: number;
  passPercentage: number;
};

export type AttendanceCounts = {
  present: number;
  absent: number;
  leave: number;
  notMarked: number;
  total: number;
};

type ExamStatus = 'ongoing' | 'completed' | 'upcoming';

/** Active-student count for the current branch + academic year. */
function currentStudentWhere(branchId: string, batchId: string) {
  return {
    isCurrent: true,
    onHold: false,
    batchId,
    student: {
      isDeleted: false,
      status: 'Active' as const,
      branchId,
    },
  };
}

/** Collapse a student's multiple period statuses into one (Absent > Leave > Present). */
function collapseStatus(statuses: AttendanceStatus[]): AttendanceStatus | null {
  if (statuses.length === 0) return null;
  if (statuses.includes('Absent')) return 'Absent';
  if (statuses.includes('Leave')) return 'Leave';
  return 'Present';
}

function computeExamStatus(
  exam: { markEntryOpenDate: Date | null; markEntryEndDate: Date | null },
  now: Date
): ExamStatus {
  if (exam.markEntryOpenDate && now < exam.markEntryOpenDate) return 'upcoming';
  if (exam.markEntryEndDate && now > exam.markEntryEndDate) return 'completed';
  return 'ongoing';
}

/**
 * Branch-wide pass/fail/absent aggregation for one exam.
 *
 * IMPORTANT: never call `getStudentMarksByFilter` without a section filter — it
 * destructures `student.section.ExamGroup[0]` and throws for sections not part
 * of the exam. We resolve the exam's participating sections from `ExamGroup`
 * and aggregate per-section, reusing the existing per-student pass/fail flags.
 */
export async function getExamBranchSummary(
  examId: string
): Promise<Omit<ExamSummary, 'id' | 'name'>> {
  const groups = await db.examGroup.findMany({
    where: { examId },
    select: { classId: true, sectionId: true },
  });

  const seenSections = new Set<string>();
  let totalStudents = 0;
  let passCount = 0;
  let failCount = 0;
  let absentCount = 0;

  for (const group of groups) {
    if (seenSections.has(group.sectionId)) continue;
    seenSections.add(group.sectionId);

    const students = await getStudentMarksByFilter({
      examId,
      classId: group.classId,
      sectionId: group.sectionId,
    });

    for (const student of students as any[]) {
      totalStudents++;
      if (student.overallAbsentStatus) absentCount++;
      if (student.failingStatus) failCount++;
      else passCount++;
    }
  }

  return {
    totalStudents,
    passCount,
    failCount,
    absentCount,
    passPercentage: calculatePercentage(passCount, passCount + failCount),
  };
}

/** Pick the ongoing and last-completed exams by mark-entry window. */
async function getDashboardExams(branchId: string, batchId: string) {
  const now = new Date();

  const [ongoing, lastCompleted] = await Promise.all([
    db.exam.findFirst({
      where: {
        isDeleted: false,
        branchId,
        batchId,
        markEntryOpenDate: { lte: now },
        OR: [{ markEntryEndDate: null }, { markEntryEndDate: { gte: now } }],
      },
      orderBy: { markEntryOpenDate: 'desc' },
      select: { id: true, name: true },
    }),
    db.exam.findFirst({
      where: {
        isDeleted: false,
        branchId,
        batchId,
        markEntryEndDate: { lt: now },
      },
      orderBy: { markEntryEndDate: 'desc' },
      select: { id: true, name: true },
    }),
  ]);

  return { ongoing, lastCompleted };
}

async function buildExamSummary(
  exam: { id: string; name: string } | null
): Promise<ExamSummary | null> {
  if (!exam) return null;
  const summary = await getExamBranchSummary(exam.id);
  return { id: exam.id, name: exam.name, ...summary };
}

export async function getAdminDashboardSummary() {
  const session = await getServerSession(authOptions);
  const branchId = session.branchId;
  const batchId = session.currentBatch;

  const [totalStudents, totalStaff, exams] = await Promise.all([
    db.studentMapping.count({ where: currentStudentWhere(branchId, batchId) }),
    db.staff.count({ where: { branchId, status: 'Active' } }),
    getDashboardExams(branchId, batchId),
  ]);

  const [ongoingExam, lastCompletedExam] = await Promise.all([
    buildExamSummary(exams.ongoing),
    buildExamSummary(exams.lastCompleted),
  ]);

  return { totalStudents, totalStaff, ongoingExam, lastCompletedExam };
}

export async function getAdminAttendanceOverview(
  dateStr: string,
  sessionScope: 'morning' | 'afternoon'
): Promise<{ students: AttendanceCounts; staff: AttendanceCounts }> {
  const session = await getServerSession(authOptions);
  const branchId = session.branchId;
  const batchId = session.currentBatch;
  const date = normalizeDate(dateStr);
  const sessionName = sessionScope === 'afternoon' ? 'Afternoon' : 'Morning';

  const [studentRows, staffData, totalStudents] = await Promise.all([
    db.studentAttendance.findMany({
      where: {
        date,
        branchId,
        academicYearId: batchId,
        level: 'Period',
        session: sessionName,
      },
      select: { studentId: true, status: true },
    }),
    getStaffAttendanceForDate(dateStr),
    db.studentMapping.count({ where: currentStudentWhere(branchId, batchId) }),
  ]);

  const byStudent = new Map<string, AttendanceStatus[]>();
  studentRows.forEach((row) => {
    const arr = byStudent.get(row.studentId) ?? [];
    arr.push(row.status as AttendanceStatus);
    byStudent.set(row.studentId, arr);
  });

  let sPresent = 0;
  let sAbsent = 0;
  let sLeave = 0;
  byStudent.forEach((statuses) => {
    const status = collapseStatus(statuses);
    if (status === 'Absent') sAbsent++;
    else if (status === 'Leave') sLeave++;
    else if (status === 'Present') sPresent++;
  });
  const studentsMarked = sPresent + sAbsent + sLeave;

  let pPresent = 0;
  let pAbsent = 0;
  let pLeave = 0;
  staffData.staff.forEach((s) => {
    if (s.status === 'Present') pPresent++;
    else if (s.status === 'Absent') pAbsent++;
    else if (s.status === 'Leave') pLeave++;
  });
  const staffTotal = staffData.staff.length;
  const staffMarked = pPresent + pAbsent + pLeave;

  return {
    students: {
      present: sPresent,
      absent: sAbsent,
      leave: sLeave,
      notMarked: Math.max(0, totalStudents - studentsMarked),
      total: totalStudents,
    },
    staff: {
      present: pPresent,
      absent: pAbsent,
      leave: pLeave,
      notMarked: Math.max(0, staffTotal - staffMarked),
      total: staffTotal,
    },
  };
}

/** All exams for the current branch + academic year, tagged with status. */
export async function getBranchExams() {
  const session = await getServerSession(authOptions);
  const now = new Date();

  const exams = await db.exam.findMany({
    where: {
      isDeleted: false,
      branchId: session.branchId,
      batchId: session.currentBatch,
    },
    orderBy: { markEntryOpenDate: 'desc' },
    select: {
      id: true,
      name: true,
      markEntryOpenDate: true,
      markEntryEndDate: true,
    },
  });

  return exams.map((exam) => ({
    id: exam.id,
    name: exam.name,
    status: computeExamStatus(exam, now),
  }));
}

/**
 * Branch-wide staff-wise analytics for one exam: runs the existing
 * `getStaffWiseMarkAnalytics` once per participating class and concatenates the
 * per-staff results, plus the overall summary block for the page header.
 */
export async function getExamBranchStaffWise(examId: string) {
  const groups = await db.examGroup.findMany({
    where: { examId },
    select: { classId: true },
  });
  const classIds = Array.from(new Set(groups.map((g) => g.classId)));

  const staffWise: any[] = [];
  for (const classId of classIds) {
    const result = await getStaffWiseMarkAnalytics({
      examId,
      classId,
      pagination: { page: 1, limit: 9999 },
    });
    staffWise.push(...result);
  }

  const summary = await getExamBranchSummary(examId);
  return { staffWise, summary };
}
