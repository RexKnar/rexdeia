import { db } from '../../../lib/db';

export async function getCourseList() {
  return await db.courseForm.findMany({
    where: { isDeleted: false }
  });
}
