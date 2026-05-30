import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { MarkStaffAttendanceModel } from 'lib/domain/timetable';
import { getServerSession } from 'next-auth';

import { normalizeDate, resolveDayId, staffFullName, weekdayName } from '../shared';

export async function getStaffAttendanceForDate(dateStr: string) {
  const session = await getServerSession(authOptions);
  const date = normalizeDate(dateStr);

  const [staff, attendance, dayId] = await Promise.all([
    db.staff.findMany({
      where: { branchId: session.branchId },
      select: { id: true, firstName: true, middleName: true, lastName: true },
      orderBy: { firstName: 'asc' },
    }),
    db.staffAttendance.findMany({
      where: { date, branchId: session.branchId },
      select: { staffId: true, status: true },
    }),
    resolveDayId(date),
  ]);

  const statusByStaff = new Map(attendance.map((a) => [a.staffId, a.status]));

  return {
    dayId,
    dayName: weekdayName(date),
    staff: staff.map((s) => ({
      id: s.id,
      name: staffFullName(s),
      status: statusByStaff.get(s.id) ?? null,
    })),
  };
}

export async function markStaffAttendance(payload: MarkStaffAttendanceModel) {
  const session = await getServerSession(authOptions);
  const date = normalizeDate(payload.date);

  return db.staffAttendance.upsert({
    where: { staffId_date: { staffId: payload.staffId, date } },
    create: {
      staffId: payload.staffId,
      date,
      status: payload.status,
      remark: payload.remark ?? null,
      branchId: session.branchId,
      organizationId: session.organizationId,
    },
    update: {
      status: payload.status,
      remark: payload.remark ?? null,
    },
  });
}
