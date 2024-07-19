import { db } from 'lib/db';

export async function getSubjectToStudentByGroupAndClassId(
  id: string,
  classId: string
) {
  return db.subjectToGroup.findMany({
    where: {
      groupId: id,
      classId,
    },
    include: {
      subject: true,
    },
  });
}
