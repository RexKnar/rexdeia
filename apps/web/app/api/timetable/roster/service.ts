import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import {
  RosterPeriod,
  RosterTodayPeriod,
  StaffRosterData,
} from 'lib/domain/timetable';
import { getServerSession } from 'next-auth';

import { normalizeDate, resolveDayId, staffFullName, weekdayName } from '../shared';

const EMPTY: StaffRosterData = {
  staff: null,
  days: [],
  weeklyByDay: {},
  today: null,
};

/**
 * Weekly timetable for a staff member (current academic year), plus today's
 * schedule with date-specific substitutions applied:
 *  - periods this staff hands over today are marked "covered" (by substitute),
 *  - periods this staff covers for others today are added as "substitution".
 * staffId is optional — when omitted it resolves to the logged-in user's staff.
 */
export async function getStaffRoster(
  staffIdParam?: string,
  dateStr?: string
): Promise<StaffRosterData> {
  const session = await getServerSession(authOptions);

  let staffId = staffIdParam;
  if (!staffId) {
    const ownStaff = await db.staff.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    });
    staffId = ownStaff?.id;
  }
  if (!staffId) return EMPTY;

  const academicYearId = session.currentBatch;

  const [staffRec, days, baseEntries] = await Promise.all([
    db.staff.findFirst({
      where: { id: staffId },
      select: { id: true, firstName: true, middleName: true, lastName: true },
    }),
    db.days.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true },
    }),
    db.timetableEntry.findMany({
      where: { staffId, academicYearId, isDeleted: false },
      include: {
        section: { select: { name: true } },
        subject: { select: { name: true } },
        slot: { select: { label: true, startTime: true, endTime: true } },
      },
    }),
  ]);

  const weeklyByDay: Record<string, RosterPeriod[]> = {};
  baseEntries.forEach((e) => {
    (weeklyByDay[e.dayId] ??= []).push({
      entryId: e.id,
      slotLabel: e.slot?.label ?? '',
      startTime: e.slot?.startTime ?? '',
      endTime: e.slot?.endTime ?? '',
      sectionName: e.section?.name ?? '',
      subjectName: e.subject?.name ?? '-',
    });
  });
  Object.values(weeklyByDay).forEach((arr) =>
    arr.sort((a, b) => a.startTime.localeCompare(b.startTime))
  );

  const date = normalizeDate(
    dateStr ?? new Date().toISOString().slice(0, 10)
  );
  const dayId = await resolveDayId(date);

  let today: StaffRosterData['today'] = {
    date: date.toISOString().slice(0, 10),
    dayId,
    dayName: weekdayName(date),
    periods: [],
  };

  if (dayId) {
    const todayBase = baseEntries.filter((e) => e.dayId === dayId);
    const todayEntryIds = todayBase.map((e) => e.id);

    const [subsForToday, subsIn] = await Promise.all([
      todayEntryIds.length
        ? db.timetableSubstitution.findMany({
            where: { date, entryId: { in: todayEntryIds } },
            include: {
              substituteStaff: {
                select: { firstName: true, middleName: true, lastName: true },
              },
            },
          })
        : Promise.resolve([]),
      db.timetableSubstitution.findMany({
        where: { date, substituteStaffId: staffId },
        include: {
          originalStaff: {
            select: { firstName: true, middleName: true, lastName: true },
          },
          entry: {
            include: {
              section: { select: { name: true } },
              subject: { select: { name: true } },
              slot: { select: { label: true, startTime: true, endTime: true } },
            },
          },
        },
      }),
    ]);

    const subByEntry = new Map(subsForToday.map((s) => [s.entryId, s]));

    const periods: RosterTodayPeriod[] = todayBase.map((e) => {
      const sub = subByEntry.get(e.id);
      const covered = sub && sub.substituteStaffId !== staffId;
      return {
        slotLabel: e.slot?.label ?? '',
        startTime: e.slot?.startTime ?? '',
        endTime: e.slot?.endTime ?? '',
        sectionName: e.section?.name ?? '',
        subjectName: e.subject?.name ?? '-',
        type: covered ? 'covered' : 'regular',
        otherStaffName: covered
          ? staffFullName(sub!.substituteStaff ?? {})
          : undefined,
      };
    });

    subsIn.forEach((s) => {
      if (!s.entry) return;
      periods.push({
        slotLabel: s.entry.slot?.label ?? '',
        startTime: s.entry.slot?.startTime ?? '',
        endTime: s.entry.slot?.endTime ?? '',
        sectionName: s.entry.section?.name ?? '',
        subjectName: s.entry.subject?.name ?? '-',
        type: 'substitution',
        otherStaffName: staffFullName(s.originalStaff ?? {}),
      });
    });

    periods.sort((a, b) => a.startTime.localeCompare(b.startTime));
    today = { ...today, periods };
  }

  return {
    staff: staffRec ? { id: staffRec.id, name: staffFullName(staffRec) } : null,
    days,
    weeklyByDay,
    today,
  };
}
