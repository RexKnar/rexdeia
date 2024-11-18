import { db } from 'lib/db';

export async function archiveStudentById(studentId: string, remark: string) {
  return db.studentMapping.updateMany({
    where: {
      studentId: studentId,
    },
    data: {
      isCurrent: false,
      remark: remark,
    },
  });
}
