import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function getUserRoleHistory(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.organizationId) {
    throw new Error('UNAUTHORIZED');
  }

  const history = await db.userRoleHistory.findMany({
    where: {
      userId,
      organizationId: session.organizationId,
      ...(session.branchId ? { branchId: session.branchId } : {}),
    },
    orderBy: {
      startDate: 'desc',
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      isCurrent: true,
      role: {
        select: {
          id: true,
          name: true,
          archetype: true,
        },
      },
      academicYear: {
        select: {
          id: true,
          name: true,
          startYear: true,
          endYear: true,
        },
      },
    },
  });

  return history;
}
