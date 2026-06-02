import { db } from 'lib/db';

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/** Parse a YYYY-MM-DD string to a UTC-midnight Date (matches Prisma @db.Date). */
export function normalizeDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export function weekdayName(date: Date): string {
  return WEEKDAYS[date.getUTCDay()];
}

/** Format a Date (stored as @db.Date, UTC midnight) back to YYYY-MM-DD. */
export function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function staffFullName(staff: {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
}): string {
  return [staff.firstName, staff.middleName, staff.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
}

/**
 * Resolve a calendar date to the matching `Days` row id by weekday name
 * (tolerant of full names or abbreviations, e.g. "Monday" / "Mon").
 */
export async function resolveDayId(date: Date): Promise<string | null> {
  const name = weekdayName(date).toLowerCase();
  const days = await db.days.findMany({
    where: { isDeleted: false },
    select: { id: true, name: true },
  });
  const match = days.find((d) => {
    const dn = d.name.trim().toLowerCase();
    return dn === name || name.startsWith(dn) || dn.startsWith(name.slice(0, 3));
  });
  return match?.id ?? null;
}
