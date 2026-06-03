import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { HolidayModel, SaveHolidayModel } from 'lib/domain/timetable';
import { getServerSession } from 'next-auth';

import { normalizeDate, todayStr, toDateStr } from '../shared';

export async function getHolidays(upcomingOnly?: boolean): Promise<HolidayModel[]> {
  const session = await getServerSession(authOptions);

  const where: Record<string, unknown> = {
    academicYearId: session.currentBatch,
    branchId: session.branchId,
  };
  if (upcomingOnly) {
    where.endDate = { gte: normalizeDate(todayStr()) };
  }

  const rows = await db.holiday.findMany({
    where,
    orderBy: { startDate: 'asc' },
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    startDate: toDateStr(r.startDate),
    endDate: toDateStr(r.endDate),
  }));
}

export async function createHoliday(payload: SaveHolidayModel) {
  const session = await getServerSession(authOptions);
  return db.holiday.create({
    data: {
      name: payload.name,
      description: payload.description ?? null,
      startDate: normalizeDate(payload.startDate),
      endDate: normalizeDate(payload.endDate || payload.startDate),
      academicYearId: session.currentBatch,
      branchId: session.branchId,
      organizationId: session.organizationId,
    },
  });
}

export async function deleteHoliday(id: string) {
  return db.holiday.delete({ where: { id } });
}
