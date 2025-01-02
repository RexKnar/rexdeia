import { db } from 'lib/db';

export async function getStudentAcademicHistoryById(id: string) {
  return await db.studentMapping.findMany({
    where: {
      studentId: id,
    },
    select: {
      batch: true,
      medium: true,
      class: true,
      section: true,
      group: true,
      isCurrent: true,
      rollNumber: true,
      remark: true,
    },
  });
}
