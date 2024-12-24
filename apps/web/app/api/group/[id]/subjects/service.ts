import { db } from 'lib/db';

export async function getSubjectToStudentByGroupAndClassId(
  groupId: string,
  classId: string
) {
  return db.subjectToGroup.findMany({
    where: {
      groupId: groupId,
      classId,
    },
    include: {
      subject: true,
    },
    orderBy: {
      subject: {
        subjectOrder: 'asc',
      },
    },
  });
}
