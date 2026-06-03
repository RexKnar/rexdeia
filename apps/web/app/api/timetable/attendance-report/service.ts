import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { AttendanceReportData } from 'lib/domain/timetable';
import { getServerSession } from 'next-auth';

import { normalizeDate, staffFullName } from '../shared';

/**
 * Per-student attendance summary for a section over a date range. Counts every
 * marked attendance unit (period rows and/or daily rows) so it works regardless
 * of how attendance was taken; percentage = present / total marked.
 */
export async function getAttendanceReport(
  sectionId: string,
  fromStr: string,
  toStr: string
): Promise<AttendanceReportData> {
  const session = await getServerSession(authOptions);
  const academicYearId = session.currentBatch;
  const from = normalizeDate(fromStr);
  const to = normalizeDate(toStr);

  const [mappings, records] = await Promise.all([
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
    db.studentAttendance.findMany({
      where: {
        sectionId,
        academicYearId,
        date: { gte: from, lte: to },
      },
      select: { studentId: true, status: true },
    }),
  ]);

  const counts = new Map<
    string,
    { present: number; absent: number; leave: number }
  >();
  records.forEach((r) => {
    const c = counts.get(r.studentId) ?? { present: 0, absent: 0, leave: 0 };
    if (r.status === 'Present') c.present += 1;
    else if (r.status === 'Absent') c.absent += 1;
    else if (r.status === 'Leave') c.leave += 1;
    counts.set(r.studentId, c);
  });

  const rows = mappings.map((m) => {
    const c = counts.get(m.student.id) ?? { present: 0, absent: 0, leave: 0 };
    const total = c.present + c.absent + c.leave;
    return {
      studentId: m.student.id,
      name: staffFullName(m.student),
      rollNumber: m.rollNumber ?? null,
      present: c.present,
      absent: c.absent,
      leave: c.leave,
      total,
      percentage: total > 0 ? Math.round((c.present / total) * 100) : 0,
    };
  });

  return { from: fromStr, to: toStr, rows };
}
