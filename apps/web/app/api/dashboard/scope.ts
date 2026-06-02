import { getAuthSession } from 'lib/auth';
import { resolveDashboardRole } from 'lib/auth/resolveDashboardRole';
import { db } from 'lib/db';

/**
 * The section scope a dashboard request is limited to.
 * `sectionIds === null` means branch-wide (admin / tech / HM).
 */
export type DashboardScope = {
  sectionIds: string[] | null;
  label: string | null;
};

/**
 * Resolve the caller's dashboard section scope from their session role:
 *  - admin / tech / hm → branch-wide (null)
 *  - ahm → sections in the classes under their incharge class level(s)
 *  - classTeacher → their incharge section(s)
 *  - staff → the sections they teach (fallback; staff view is separate)
 *
 * Scope is always derived server-side from the session — never client-supplied.
 */
export async function resolveDashboardScope(): Promise<DashboardScope> {
  const session = await getAuthSession();
  if (!session) return { sectionIds: null, label: null };

  const role = await resolveDashboardRole(session);
  if (role === 'admin' || role === 'tech' || role === 'hm') {
    return { sectionIds: null, label: null };
  }

  const staffId = session.user?.staffId;
  const batch = session.currentBatch;
  if (!staffId || !batch) {
    return { sectionIds: [], label: null };
  }

  if (role === 'ahm') {
    const incharge = await db.classLevelIncharge.findMany({
      where: { staffId, academicYearId: batch },
      select: { classLevel: { select: { id: true, name: true } } },
    });
    const classLevelIds = incharge.map((i) => i.classLevel.id);
    const sections = await db.section.findMany({
      where: {
        academicYearId: batch,
        class: { classLevelId: { in: classLevelIds } },
      },
      select: { id: true },
    });
    const names = incharge.map((i) => i.classLevel.name).filter(Boolean);
    return {
      sectionIds: sections.map((s) => s.id),
      label: names.length ? `Class Levels: ${names.join(', ')}` : null,
    };
  }

  if (role === 'classTeacher') {
    const rows = await db.academicSubjectForStaff.findMany({
      where: {
        staffId,
        isIncharge: true,
        academicYearId: batch,
        deletedAt: null,
      },
      select: {
        sectionId: true,
        section: {
          select: { name: true, class: { select: { name: true } } },
        },
      },
    });
    const sectionIds = Array.from(new Set(rows.map((r) => r.sectionId)));
    const names = Array.from(
      new Set(
        rows
          .map((r) =>
            [r.section?.class?.name, r.section?.name]
              .filter(Boolean)
              .join(' - ')
          )
          .filter(Boolean)
      )
    );
    return {
      sectionIds,
      label: names.length ? `Section: ${names.join(', ')}` : null,
    };
  }

  // Normal staff: the sections they teach.
  const rows = await db.academicSubjectForStaff.findMany({
    where: { staffId, academicYearId: batch, deletedAt: null },
    select: { sectionId: true },
  });
  return {
    sectionIds: Array.from(new Set(rows.map((r) => r.sectionId))),
    label: 'My Classes',
  };
}
