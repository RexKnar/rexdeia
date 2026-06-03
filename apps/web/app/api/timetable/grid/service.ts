import { getAllStaffsBySectionsIdWithSubjects } from 'app/api/staff/service';
import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import {
  GridConflict,
  SaveTimetableGridModel,
} from 'lib/domain/timetable';
import { getServerSession } from 'next-auth';

function toMinutes(time: string): number {
  const [h, m] = (time || '').split(':').map((v) => parseInt(v, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

function staffName(staff: {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
}) {
  return [staff.firstName, staff.middleName, staff.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
}

/**
 * Composes everything the period-table grid builder needs for one section in
 * the current academic year: the class level's structure (period/interval
 * slots), weekdays, the section's subjects + teaching staff, the saved entries,
 * and any staff double-booking conflicts.
 */
export async function getTimetableGrid(sectionId: string) {
  const session = await getServerSession(authOptions);
  const academicYearId = session.currentBatch;

  const section = await db.section.findFirst({
    where: { id: sectionId },
    include: { class: { select: { id: true, name: true, classLevelId: true } } },
  });

  if (!section) throw new Error('SECTION_NOT_FOUND');

  const structure = section.class?.classLevelId
    ? await db.timetableStructure.findFirst({
        where: {
          classLevelId: section.class.classLevelId,
          isDeleted: false,
          branchId: session.branchId,
          organizationId: session.organizationId,
        },
        include: {
          slots: {
            where: { isDeleted: false },
            orderBy: { order: 'asc' },
            include: { periodType: { select: { id: true, name: true } } },
          },
        },
      })
    : null;

  const [days, staffWithSubjects, entries, dayOffRows] = await Promise.all([
    db.days.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true },
    }),
    getAllStaffsBySectionsIdWithSubjects([sectionId]),
    db.timetableEntry.findMany({
      where: { academicYearId, sectionId, isDeleted: false },
      select: {
        id: true,
        dayId: true,
        slotId: true,
        subjectId: true,
        staffId: true,
      },
    }),
    db.timetableDayOff.findMany({
      where: { academicYearId, sectionId },
      select: { dayId: true },
    }),
  ]);

  // Subjects + staff for the dropdowns, derived from who teaches in this section.
  const subjectMap = new Map<string, string>();
  const staff = (staffWithSubjects as any[]).map((s) => {
    const subjectIds: string[] = [];
    (s.subjects ?? []).forEach((subj: { id: string; name: string }) => {
      if (subj?.id) {
        subjectMap.set(subj.id, subj.name);
        subjectIds.push(subj.id);
      }
    });
    return { id: s.id, name: staffName(s), subjectIds };
  });
  const subjects = Array.from(subjectMap.entries()).map(([id, name]) => ({
    id,
    name,
  }));

  const conflicts = await computeConflicts(
    academicYearId,
    sectionId,
    structure,
    entries,
    staff
  );

  return {
    section: {
      id: section.id,
      name: section.name,
      classId: section.class?.id ?? '',
      className: section.class?.name ?? '',
      classLevelId: section.class?.classLevelId ?? null,
    },
    structure: structure
      ? {
          id: structure.id,
          dayStartTime: structure.dayStartTime,
          slots: structure.slots,
        }
      : null,
    days,
    subjects,
    staff,
    entries,
    conflicts,
    dayOffs: dayOffRows.map((d) => d.dayId),
  };
}

/**
 * Flags cells where the assigned staff is already booked in another section at
 * an overlapping time on the same weekday.
 */
async function computeConflicts(
  academicYearId: string,
  sectionId: string,
  structure: { slots: { id: string; startTime: string; endTime: string }[] } | null,
  entries: { dayId: string; slotId: string; staffId: string | null }[],
  staff: { id: string; name: string }[]
): Promise<GridConflict[]> {
  if (!structure) return [];

  const staffIds = Array.from(
    new Set(entries.map((e) => e.staffId).filter(Boolean) as string[])
  );
  if (staffIds.length === 0) return [];

  const slotById = new Map(structure.slots.map((s) => [s.id, s]));
  const staffNameById = new Map(staff.map((s) => [s.id, s.name]));

  const others = await db.timetableEntry.findMany({
    where: {
      academicYearId,
      isDeleted: false,
      sectionId: { not: sectionId },
      staffId: { in: staffIds },
    },
    select: {
      dayId: true,
      staffId: true,
      slot: { select: { startTime: true, endTime: true } },
      section: { select: { name: true } },
    },
  });

  const conflicts: GridConflict[] = [];
  for (const entry of entries) {
    if (!entry.staffId) continue;
    const slot = slotById.get(entry.slotId);
    if (!slot) continue;
    const start = toMinutes(slot.startTime);
    const end = toMinutes(slot.endTime);

    for (const other of others) {
      if (other.staffId !== entry.staffId || other.dayId !== entry.dayId)
        continue;
      const oStart = toMinutes(other.slot?.startTime ?? '');
      const oEnd = toMinutes(other.slot?.endTime ?? '');
      if (start < oEnd && oStart < end) {
        conflicts.push({
          dayId: entry.dayId,
          slotId: entry.slotId,
          staffId: entry.staffId,
          staffName: staffNameById.get(entry.staffId) ?? 'Staff',
          withSection: other.section?.name ?? 'another section',
          time: `${slot.startTime}–${slot.endTime}`,
        });
        break;
      }
    }
  }
  return conflicts;
}

export async function saveTimetableGrid(payload: SaveTimetableGridModel) {
  const session = await getServerSession(authOptions);
  const academicYearId = session.currentBatch;
  const { sectionId, entries } = payload;
  const dayOffs = payload.dayOffs ?? [];
  const offSet = new Set(dayOffs);

  return db.$transaction(async (tx) => {
    // Sync day-off records for the section.
    const existingOffs = await tx.timetableDayOff.findMany({
      where: { academicYearId, sectionId },
      select: { id: true, dayId: true },
    });
    for (const off of existingOffs) {
      if (!offSet.has(off.dayId)) {
        await tx.timetableDayOff.delete({ where: { id: off.id } });
      }
    }
    for (const dayId of dayOffs) {
      if (!existingOffs.some((o) => o.dayId === dayId)) {
        await tx.timetableDayOff.create({
          data: {
            academicYearId,
            sectionId,
            dayId,
            branchId: session.branchId,
            organizationId: session.organizationId,
          },
        });
      }
    }
    // An off day carries no period assignments.
    if (dayOffs.length) {
      await tx.timetableEntry.deleteMany({
        where: { academicYearId, sectionId, dayId: { in: dayOffs } },
      });
    }

    for (const cell of entries) {
      if (offSet.has(cell.dayId)) continue;
      const existing = await tx.timetableEntry.findFirst({
        where: { academicYearId, sectionId, dayId: cell.dayId, slotId: cell.slotId },
        select: { id: true },
      });

      if (!cell.subjectId && !cell.staffId) {
        if (existing) {
          await tx.timetableEntry.delete({ where: { id: existing.id } });
        }
        continue;
      }

      if (existing) {
        await tx.timetableEntry.update({
          where: { id: existing.id },
          data: {
            subjectId: cell.subjectId,
            staffId: cell.staffId,
            isDeleted: false,
          },
        });
      } else {
        await tx.timetableEntry.create({
          data: {
            academicYearId,
            sectionId,
            dayId: cell.dayId,
            slotId: cell.slotId,
            subjectId: cell.subjectId,
            staffId: cell.staffId,
            branchId: session.branchId,
            organizationId: session.organizationId,
          },
        });
      }
    }

    return { success: true };
  });
}
