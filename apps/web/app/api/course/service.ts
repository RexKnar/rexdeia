import { db } from '../../../lib/db';

export async function getCourseList({ organizationId, branchId }) {
  return await db.course.findMany({
    where: { isDeleted: false },
    include: {
      department: {
        where: {
          organizationId: organizationId,
          branchId: branchId,
        },
      },
    },
  });
}
