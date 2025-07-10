import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function getAllClassLevelByStaffId(id: string) {
  const session = await getServerSession(authOptions);
  return await db.classLevelIncharge.findFirst({
    where: {
      staffId: id,
      academicYearId: session.currentBatch,
    },
    include: {
      classLevel: {
        include: {
          class: {
            include: {
              Section: true,
            },
          },
        },
      },
    },
  });
}
