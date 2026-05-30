import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import {
  AttendanceStatus,
  SaveStudentAttendanceModel,
  StudentAttendanceData,
  StudentAttendanceScope,
} from 'lib/domain/timetable';
import { getServerSession } from 'next-auth';

import { normalizeDate, staffFullName } from '../shared';

/** Period slots (with session) of the structure for a section's class level. */
async function getSectionPeriodSlots(
  sectionId: string,
  branchId: string,
  organizationId: string
) {
  const section = await db.section.findFirst({
    where: { id: sectionId },
    select: { class: { select: { classLevelId: true } } },
  });
  const classLevelId = section?.class?.classLevelId;
  if (!classLevelId) return [];

  const structure = await db.timetableStructure.findFirst({
    where: { classLevelId, isDeleted: false, branchId, organizationId },
    include: {
      slots: {
        where: { isDeleted: false, kind: 'Period' },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          label: true,
          startTime: true,
          endTime: true,
          session: true,
        },
      },
    },
  });
  return structure?.slots ?? [];
}

function deriveStatus(
  statuses: AttendanceStatus[]
): AttendanceStatus | null {
  if (statuses.length === 0) return null;
  if (statuses.includes('Absent')) return 'Absent';
  if (statuses.includes('Leave')) return 'Leave';
  return 'Present';
}

export async function getStudentAttendance(
  sectionId: string,
  dateStr: string,
  scope: StudentAttendanceScope,
  slotId?: string
): Promise<StudentAttendanceData> {
  const session = await getServerSession(authOptions);
  const academicYearId = session.currentBatch;
  const date = normalizeDate(dateStr);

  const [slots, mappings] = await Promise.all([
    getSectionPeriodSlots(sectionId, session.branchId, session.organizationId),
    db.studentMapping.findMany({
      where: {
        sectionId,
        isCurrent: true,
        batchId: academicYearId,
        student: {
          isDeleted: false,
          status: 'Active',
          branchId: session.branchId,
          organizationId: session.organizationId,
        },
      },
      select: {
        rollNumber: true,
        student: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
      orderBy: [{ rollNumber: 'asc' }],
    }),
  ]);

  // Which attendance rows are relevant for the chosen scope.
  let relevant: { studentId: string; status: AttendanceStatus }[] = [];
  if (scope === 'daily') {
    relevant = await db.studentAttendance.findMany({
      where: { sectionId, date, level: 'Daily' },
      select: { studentId: true, status: true },
    });
  } else if (scope === 'period' && slotId) {
    relevant = await db.studentAttendance.findMany({
      where: { sectionId, date, level: 'Period', slotId },
      select: { studentId: true, status: true },
    });
  } else if (scope === 'morning' || scope === 'afternoon') {
    const sessionName = scope === 'morning' ? 'Morning' : 'Afternoon';
    const sessionSlotIds = slots
      .filter((s) => s.session === sessionName)
      .map((s) => s.id);
    if (sessionSlotIds.length) {
      relevant = await db.studentAttendance.findMany({
        where: {
          sectionId,
          date,
          level: 'Period',
          slotId: { in: sessionSlotIds },
        },
        select: { studentId: true, status: true },
      });
    }
  }

  const byStudent = new Map<string, AttendanceStatus[]>();
  relevant.forEach((r) => {
    const arr = byStudent.get(r.studentId) ?? [];
    arr.push(r.status as AttendanceStatus);
    byStudent.set(r.studentId, arr);
  });

  return {
    structureMissing: slots.length === 0,
    slots,
    students: mappings.map((m) => ({
      studentId: m.student.id,
      name: staffFullName(m.student),
      rollNumber: m.rollNumber ?? null,
      status: deriveStatus(byStudent.get(m.student.id) ?? []),
    })),
  };
}

export async function saveStudentAttendance(
  payload: SaveStudentAttendanceModel
) {
  const session = await getServerSession(authOptions);
  const academicYearId = session.currentBatch;
  const date = normalizeDate(payload.date);
  const { sectionId, scope, statuses } = payload;

  const ownStaff = await db.staff.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });
  const markedByStaffId = ownStaff?.id ?? null;

  const base = {
    sectionId,
    academicYearId,
    date,
    markedByStaffId,
    branchId: session.branchId,
    organizationId: session.organizationId,
  };

  // Resolve the target slots for the scope.
  let targetSlots: { id: string; session: 'Morning' | 'Afternoon' }[] = [];
  if (scope === 'period' && payload.slotId) {
    const slot = await db.timetableSlot.findUnique({
      where: { id: payload.slotId },
      select: { id: true, session: true },
    });
    if (slot) targetSlots = [{ id: slot.id, session: slot.session as any }];
  } else if (scope === 'morning' || scope === 'afternoon') {
    const slots = await getSectionPeriodSlots(
      sectionId,
      session.branchId,
      session.organizationId
    );
    const sessionName = scope === 'morning' ? 'Morning' : 'Afternoon';
    targetSlots = slots
      .filter((s) => s.session === sessionName)
      .map((s) => ({ id: s.id, session: sessionName }));
  }

  return db.$transaction(async (tx) => {
    for (const { studentId, status } of statuses) {
      if (scope === 'daily') {
        const existing = await tx.studentAttendance.findFirst({
          where: { studentId, date, sectionId, level: 'Daily' },
          select: { id: true },
        });
        if (existing) {
          await tx.studentAttendance.update({
            where: { id: existing.id },
            data: { status, markedByStaffId },
          });
        } else {
          await tx.studentAttendance.create({
            data: { ...base, studentId, level: 'Daily', status, slotId: null, session: null },
          });
        }
        continue;
      }

      for (const slot of targetSlots) {
        await tx.studentAttendance.upsert({
          where: {
            studentId_date_slotId: { studentId, date, slotId: slot.id },
          },
          create: {
            ...base,
            studentId,
            level: 'Period',
            slotId: slot.id,
            session: slot.session,
            status,
          },
          update: { status, markedByStaffId },
        });
      }
    }
    return { success: true };
  });
}
