import { db } from '../../../../lib/db';

export async function deleteExamById(id: string) {
  return db.exam.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
}
