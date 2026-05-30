import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { SaveSubstitutionModel } from 'lib/domain/timetable';
import { getServerSession } from 'next-auth';

import { normalizeDate, resolveDayId, staffFullName } from '../shared';

/**
 * For an (absent) staff member on a given date, returns the periods they teach
 * that weekday plus any substitute already assigned, and the list of candidate
 * substitute staff.
 */
export async function getStaffSubstitutionForDate(
  staffId: string,
  dateStr: string
) {
  const session = await getServerSession(authOptions);
  const date = normalizeDate(dateStr);
  const dayId = await resolveDayId(date);

  if (!dayId) {
    return { dayId: null, periods: [], candidates: [] };
  }

  const entries = await db.timetableEntry.findMany({
    where: {
      staffId,
      dayId,
      academicYearId: session.currentBatch,
      isDeleted: false,
    },
    include: {
      section: { select: { name: true } },
      subject: { select: { name: true } },
      slot: { select: { label: true, startTime: true, endTime: true, order: true } },
    },
    orderBy: { slot: { order: 'asc' } },
  });

  const subs = entries.length
    ? await db.timetableSubstitution.findMany({
        where: { date, entryId: { in: entries.map((e) => e.id) } },
        select: { entryId: true, substituteStaffId: true },
      })
    : [];
  const subByEntry = new Map(subs.map((s) => [s.entryId, s.substituteStaffId]));

  const candidates = await db.staff.findMany({
    where: { branchId: session.branchId, id: { not: staffId } },
    select: { id: true, firstName: true, middleName: true, lastName: true },
    orderBy: { firstName: 'asc' },
  });

  return {
    dayId,
    periods: entries.map((e) => ({
      entryId: e.id,
      slotLabel: e.slot?.label ?? '',
      time: `${e.slot?.startTime ?? ''}–${e.slot?.endTime ?? ''}`,
      sectionName: e.section?.name ?? '',
      subjectName: e.subject?.name ?? '-',
      substituteStaffId: subByEntry.get(e.id) ?? null,
    })),
    candidates: candidates.map((c) => ({ id: c.id, name: staffFullName(c) })),
  };
}

export async function saveSubstitution(payload: SaveSubstitutionModel) {
  const session = await getServerSession(authOptions);
  const date = normalizeDate(payload.date);

  // Clearing the substitute removes the override for that date.
  if (!payload.substituteStaffId) {
    const existing = await db.timetableSubstitution.findFirst({
      where: { entryId: payload.entryId, date },
      select: { id: true },
    });
    if (existing) {
      await db.timetableSubstitution.delete({ where: { id: existing.id } });
    }
    return { success: true };
  }

  return db.timetableSubstitution.upsert({
    where: { entryId_date: { entryId: payload.entryId, date } },
    create: {
      date,
      entryId: payload.entryId,
      originalStaffId: payload.originalStaffId ?? null,
      substituteStaffId: payload.substituteStaffId,
      reason: payload.reason ?? null,
      branchId: session.branchId,
      organizationId: session.organizationId,
    },
    update: {
      substituteStaffId: payload.substituteStaffId,
      reason: payload.reason ?? null,
    },
  });
}
