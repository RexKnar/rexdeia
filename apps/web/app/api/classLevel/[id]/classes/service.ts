import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

function sortClasses(classes: any[]) {
  return [...classes].sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });
}

export async function getClassListByClassLevelId(classLevelId: string) {
  const session = await getServerSession(authOptions);

  const { branchId } = session;

  const classes = await db.class.findMany({
    where: {
      classLevelId,
      branchId,
      isActive: true,
    },
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

  return sortClasses(classes);
}
