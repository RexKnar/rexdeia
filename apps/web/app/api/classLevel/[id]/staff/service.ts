import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

type AssignStaffToClassLevelParams = {
  classLevelId: string;
  staffId: string;
};

export async function assignStaffToClassLevel({
  classLevelId,
  staffId,
}: AssignStaffToClassLevelParams) {
  const session = await getServerSession(authOptions);

  if (
    !session?.branchId ||
    !session?.organizationId ||
    !session?.currentBatch
  ) {
    throw new Error('Unauthorized');
  }

  const existingAssignment = await db.classLevelIncharge.findFirst({
    where: {
      classLevelId,
      staffId,
      academicYearId: session.currentBatch,
      branchId: session.branchId,
      organizationId: session.organizationId,
    },
  });

  if (!existingAssignment) {
    return db.classLevelIncharge.create({
      data: {
        classLevelId,
        staffId,
        academicYearId: session.currentBatch,
        branchId: session.branchId,
        organizationId: session.organizationId,
      },
    });
  }

  return existingAssignment;
}
