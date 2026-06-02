import { calculatePercentage } from 'app/api/analytics/master/comparison/service';
import {
  analyzeSubjectPerformance,
  getStaffListByClass,
} from 'app/api/analytics/master/comparison/staff/service';
import { getStudentMarksByFilter } from 'app/api/analytics/service';
import { normalizeDate } from 'app/api/timetable/shared';
import { getStaffAttendanceForDate } from 'app/api/timetable/staff-attendance/service';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { AttendanceStatus } from 'lib/domain/timetable';
import { getServerSession } from 'next-auth';

import { resolveDashboardScope } from '../scope';

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

/** Active-student count clause for the current branch + academic year, scoped to sections when set. */
function studentWhere(
  branchId: string,
  batchId: string,
  sectionIds: string[] | null
) {
  return {
    isCurrent: true,
    onHold: false,
    batchId,
    ...(sectionIds !== null ? { sectionId: { in: sectionIds } } : {}),
    student: {
      isDeleted: false,
      status: 'Active' as const,
      branchId,
    },
  };
}

/** Distinct staff teaching the given sections in the current academic year. */
async function scopedStaffIds(
  sectionIds: string[],
  batchId: string
): Promise<string[]> {
  const rows = await db.academicSubjectForStaff.findMany({
    where: {
      sectionId: { in: sectionIds },
      academicYearId: batchId,
      deletedAt: null,
    },
    select: { staffId: true },
    distinct: ['staffId'],
  });
  return rows.map((r) => r.staffId);
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
 * Pass/fail/absent aggregation for one exam, optionally scoped to sections.
 *
 * IMPORTANT: never call `getStudentMarksByFilter` without a section filter — it
 * destructures `student.section.ExamGroup[0]` and throws for sections not part
 * of the exam. We resolve the exam's participating sections from `ExamGroup`
 * and aggregate per-section, reusing the existing per-student pass/fail flags.
 */
export async function getExamBranchSummary(
  examId: string,
  sectionIds: string[] | null = null
): Promise<Omit<ExamSummary, 'id' | 'name'>> {
  const groups = await db.examGroup.findMany({
    where: {
      examId,
      ...(sectionIds !== null ? { sectionId: { in: sectionIds } } : {}),
    },
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

/** Pick the ongoing and last-completed exams by mark-entry window (branch timeline). */
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
  exam: { id: string; name: string } | null,
  sectionIds: string[] | null
): Promise<ExamSummary | null> {
  if (!exam) return null;
  const summary = await getExamBranchSummary(exam.id, sectionIds);
  return { id: exam.id, name: exam.name, ...summary };
}

export async function getAdminDashboardSummary() {
  const session = await getServerSession(authOptions);
  const branchId = session.branchId;
  const batchId = session.currentBatch;
  const { sectionIds, label } = await resolveDashboardScope();

  const [totalStudents, totalStaff, exams] = await Promise.all([
    db.studentMapping.count({
      where: studentWhere(branchId, batchId, sectionIds),
    }),
    sectionIds === null
      ? db.staff.count({ where: { branchId, status: 'Active' } })
      : scopedStaffIds(sectionIds, batchId).then((ids) => ids.length),
    getDashboardExams(branchId, batchId),
  ]);

  const [ongoingExam, lastCompletedExam] = await Promise.all([
    buildExamSummary(exams.ongoing, sectionIds),
    buildExamSummary(exams.lastCompleted, sectionIds),
  ]);

  return {
    totalStudents,
    totalStaff,
    ongoingExam,
    lastCompletedExam,
    scopeLabel: label,
  };
}

export async function getAdminAttendanceOverview(
  dateStr: string,
  sessionScope: 'morning' | 'afternoon'
): Promise<{ students: AttendanceCounts; staff: AttendanceCounts }> {
  const session = await getServerSession(authOptions);
  const branchId = session.branchId;
  const batchId = session.currentBatch;
  const { sectionIds } = await resolveDashboardScope();
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
        ...(sectionIds !== null ? { sectionId: { in: sectionIds } } : {}),
      },
      select: { studentId: true, status: true },
    }),
    getStaffAttendanceForDate(dateStr),
    db.studentMapping.count({
      where: studentWhere(branchId, batchId, sectionIds),
    }),
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

  // Scope the staff overview to staff teaching the scoped sections.
  let staffList = staffData.staff;
  if (sectionIds !== null) {
    const ids = new Set(await scopedStaffIds(sectionIds, batchId));
    staffList = staffData.staff.filter((s) => ids.has(s.id));
  }

  let pPresent = 0;
  let pAbsent = 0;
  let pLeave = 0;
  staffList.forEach((s) => {
    if (s.status === 'Present') pPresent++;
    else if (s.status === 'Absent') pAbsent++;
    else if (s.status === 'Leave') pLeave++;
  });
  const staffTotal = staffList.length;
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

/** Exams for the current branch + academic year, tagged with status; scoped to the caller's sections. */
export async function getBranchExams() {
  const session = await getServerSession(authOptions);
  const { sectionIds } = await resolveDashboardScope();
  const now = new Date();

  const exams = await db.exam.findMany({
    where: {
      isDeleted: false,
      branchId: session.branchId,
      batchId: session.currentBatch,
      ...(sectionIds !== null
        ? { examGroup: { some: { sectionId: { in: sectionIds } } } }
        : {}),
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
 * Staff-wise analytics for one exam, scoped to the caller's sections.
 *
 * Crash-safe: builds the student mark list by calling `getStudentMarksByFilter`
 * once per section (never per-class without a section filter), then reuses
 * `getStaffListByClass` + `analyzeSubjectPerformance` and keeps only in-scope
 * sections that participate in the exam.
 */
export async function getExamBranchStaffWise(examId: string) {
  const { sectionIds } = await resolveDashboardScope();

  const groups = await db.examGroup.findMany({
    where: {
      examId,
      ...(sectionIds !== null ? { sectionId: { in: sectionIds } } : {}),
    },
    select: { classId: true, sectionId: true },
  });
  const scopedSections = new Set(groups.map((g) => g.sectionId));
  const classIds = Array.from(new Set(groups.map((g) => g.classId)));

  // Safe per-section student marks for every participating section.
  const seen = new Set<string>();
  const studentsMarkList: any[] = [];
  for (const group of groups) {
    if (seen.has(group.sectionId)) continue;
    seen.add(group.sectionId);
    const students = await getStudentMarksByFilter({
      examId,
      classId: group.classId,
      sectionId: group.sectionId,
    });
    studentsMarkList.push(...students);
  }

  const staffWise: any[] = [];
  for (const classId of classIds) {
    const staffList = await getStaffListByClass(classId);
    for (const staff of staffList as any[]) {
      const items = (staff.academicSubjects ?? []).filter(
        (a: any) => a.section && scopedSections.has(a.section.id)
      );
      if (!items.length) continue;
      const analytics = items.map((a: any) => ({
        ...analyzeSubjectPerformance(
          a.subject?.id,
          a.section?.id,
          studentsMarkList
        ),
        section: a.section,
        subject: a.subject,
      }));
      staffWise.push({ ...staff, analytics });
    }
  }

  const summary = await getExamBranchSummary(examId, sectionIds);
  return { staffWise, summary };
}
