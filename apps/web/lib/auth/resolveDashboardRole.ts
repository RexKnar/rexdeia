import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';

import { getAuthSession } from '../auth';
import { db } from '../db';

export type DashboardRole =
  | 'admin'
  | 'hm'
  | 'ahm'
  | 'staff'
  | 'classTeacher'
  | 'tech';

/**
 * Derive the dashboard role for a session.
 *
 * The dynamic org `Role` carries a static `roleType` classifier
 * (admin | hm | ahm | staff | tech). AHM and class teacher are *derived from
 * data* for staff-type users:
 *  - a staff with a `ClassLevelIncharge` (current academic year) is an AHM
 *  - a staff who is a section incharge (`AcademicSubjectForStaff.isIncharge`)
 *    is a class teacher
 *
 * Users with no staff record / no roleType fall back to `admin`, which keeps
 * today's default landing of `/admission/dashboard`.
 */
export async function resolveDashboardRole(
  session: Session
): Promise<DashboardRole> {
  const roleType = session.user?.organizationRole?.roleType;

  if (roleType === 'admin') return 'admin';
  if (roleType === 'hm') return 'hm';
  if (roleType === 'tech') return 'tech';
  if (roleType === 'ahm') return 'ahm';

  // roleType === 'staff' (or unset, as a safety net): derive from incharge data.
  const staffId = session.user?.staffId;
  const academicYearId = session.currentBatch;

  if (staffId && academicYearId) {
    const classLevelIncharge = await db.classLevelIncharge.findFirst({
      where: { staffId, academicYearId },
      select: { id: true },
    });
    if (classLevelIncharge) return 'ahm';

    const sectionIncharge = await db.academicSubjectForStaff.findFirst({
      where: {
        staffId,
        academicYearId,
        isIncharge: true,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (sectionIncharge) return 'classTeacher';
  }

  if (staffId) return 'staff';

  return 'admin';
}

/**
 * Map a derived dashboard role to its landing route.
 */
export function dashboardPathForRole(role: DashboardRole): string {
  switch (role) {
    case 'hm':
      return '/hm/dashboard';
    case 'ahm':
      return '/ahm/dashboard';
    case 'staff':
    case 'classTeacher':
      return '/staff/dashboard';
    case 'admin':
    case 'tech':
    default:
      return '/admin/dashboard';
  }
}

/**
 * Guard for dashboard pages: resolves the current role and redirects the user
 * to their own dashboard if it is not in `allowed`. Returns the resolved role.
 */
export async function requireDashboardRole(
  allowed: DashboardRole[]
): Promise<DashboardRole> {
  const session = await getAuthSession();
  if (!session) {
    redirect('/signin');
  }

  const role = await resolveDashboardRole(session);
  if (!allowed.includes(role)) {
    redirect(dashboardPathForRole(role));
  }

  return role;
}
