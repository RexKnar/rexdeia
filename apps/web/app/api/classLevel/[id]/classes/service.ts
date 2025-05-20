import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function getClassListByClassLevelId(classLevelId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('UNAUTHORIZED');

  const { branchId } = session;

  const classes = await db.class.findMany({
    where: {
      classLevelId,
      branchId,
      isActive: true,
    },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      isActive: true,
      Section: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },
    },
  });

  return classes;
}
