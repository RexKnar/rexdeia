import { db } from '../../../lib/db';

export async function getDeparment(departmentId) {
  return await db.departmentForm.findMany({
    where: {
      id: departmentId,
    },
  });
}
