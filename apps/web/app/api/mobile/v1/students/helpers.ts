import { db } from 'lib/db';

/**
 * Verifies whether the authenticated user in the session is:
 * 1. An Admin or SuperAdmin, OR
 * 2. Assigned as incharge of the given section in AcademicSubjectForStaff (isIncharge: true), OR
 * 3. Assigned as staffId on the Section model itself.
 */
export async function verifySectionIncharge(
  session: any,
  sectionId?: string | null,
  batchId?: string | null
): Promise<boolean> {
  if (!session?.user?.id) return false;

  const userRole = (session.user as any)?.role;
  if (userRole === 'Admin' || userRole === 'SuperAdmin') {
    return true;
  }

  if (!sectionId) return false;

  let staffId: string | null = (session.user as any)?.staffId || null;
  if (!staffId) {
    const staffRecord = await db.staff.findFirst({
      where: {
        OR: [
          { userId: session.user.id },
          ...(session.user.email ? [{ email: session.user.email }] : []),
        ],
      },
      select: { id: true },
    });
    staffId = staffRecord?.id || null;
  }

  if (!staffId) return false;

  const [inchargeAssignment, inchargeSection] = await Promise.all([
    db.academicSubjectForStaff.findFirst({
      where: {
        staffId,
        sectionId,
        isIncharge: true,
        deletedAt: null,
        ...(batchId ? { academicYearId: batchId } : {}),
      },
      select: { id: true },
    }),
    db.section.findFirst({
      where: {
        id: sectionId,
        staffId,
        isDeleted: false,
      },
      select: { id: true },
    }),
  ]);

  return Boolean(inchargeAssignment || inchargeSection);
}
