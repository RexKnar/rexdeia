import { db } from 'lib/db';

export async function archiveStudentById(studentId: string, sectionId: string, batchId: string, remark: string) {
  return db.studentMapping.updateMany({
    where: {
      studentId: studentId,
      isCurrent: true,
      sectionId: sectionId,
      batchId: batchId
    },
    data: {
      isCurrent: false,
      remark: remark,
    },
  });
}
