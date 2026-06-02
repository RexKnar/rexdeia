import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { PeriodStatsData, PeriodStatsScope } from 'lib/domain/timetable';
import { getServerSession } from 'next-auth';

import { normalizeDate, todayStr } from '../shared';

const WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

/**
 * Counts scheduled periods for a staff member or a section over a date range,
 * excluding holidays, section day-offs and non-working weekdays. "Completed"
 * counts periods up to today. Uses the base timetable (substitutions, which are
 * date-specific staff swaps, don't change the period count).
 */
export async function getPeriodStats(
  scope: PeriodStatsScope,
  id: string,
  fromStr: string,
  toStr: string
): Promise<PeriodStatsData> {
  const session = await getServerSession(authOptions);
  const academicYearId = session.currentBatch;
  const from = normalizeDate(fromStr);
  const to = normalizeDate(toStr);
  const tStr = todayStr();
  const today = normalizeDate(tStr);

  const emptyResult: PeriodStatsData = {
    from: fromStr,
    to: toStr,
    today: tStr,
    totalPeriods: 0,
    completedPeriods: 0,
    remainingPeriods: 0,
    workingDays: 0,
    holidayDays: 0,
  };

  // For "my" staff stats, resolve the logged-in user's staff record.
  let targetId = id;
  if (scope === 'staff' && (!id || id === 'me')) {
    const own = await db.staff.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    });
    if (!own) return emptyResult;
    targetId = own.id;
  }

  const days = await db.days.findMany({
    where: { isActive: true, isDeleted: false },
    select: { id: true, name: true },
  });
  const dayIdByName = new Map(days.map((d) => [d.name.trim().toLowerCase(), d.id]));

  const entries = await db.timetableEntry.findMany({
    where: {
      academicYearId,
      isDeleted: false,
      ...(scope === 'section'
        ? { sectionId: targetId, subjectId: { not: null } }
        : { staffId: targetId }),
    },
    select: { dayId: true },
  });
  const periodsByDay = new Map<string, number>();
  entries.forEach((e) =>
    periodsByDay.set(e.dayId, (periodsByDay.get(e.dayId) ?? 0) + 1)
  );

  let dayOffSet = new Set<string>();
  if (scope === 'section') {
    const offs = await db.timetableDayOff.findMany({
      where: { academicYearId, sectionId: targetId },
      select: { dayId: true },
    });
    dayOffSet = new Set(offs.map((o) => o.dayId));
  }

  const holidays = await db.holiday.findMany({
    where: {
      academicYearId,
      branchId: session.branchId,
      startDate: { lte: to },
      endDate: { gte: from },
    },
    select: { startDate: true, endDate: true },
  });

  let totalPeriods = 0;
  let completedPeriods = 0;
  let workingDays = 0;
  let holidayDays = 0;

  for (
    const d = new Date(from);
    d <= to;
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    const dayId = dayIdByName.get(WEEK[d.getUTCDay()]);
    if (!dayId) continue; // weekday not configured → non-working
    if (dayOffSet.has(dayId)) continue;

    const isHoliday = holidays.some(
      (h) => d >= h.startDate && d <= h.endDate
    );
    if (isHoliday) {
      holidayDays += 1;
      continue;
    }

    const count = periodsByDay.get(dayId) ?? 0;
    if (count === 0) continue;

    workingDays += 1;
    totalPeriods += count;
    if (d <= today) completedPeriods += count;
  }

  return {
    from: fromStr,
    to: toStr,
    today: tStr,
    totalPeriods,
    completedPeriods,
    remainingPeriods: totalPeriods - completedPeriods,
    workingDays,
    holidayDays,
  };
}
