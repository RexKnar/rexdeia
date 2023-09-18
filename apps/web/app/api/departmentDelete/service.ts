import { db } from '../../../lib/db';

export async function deleteDeparment(departmentId) {
  return await db.departmentForm.update({
    where: {
      id: departmentId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
}
