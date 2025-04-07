import { db } from 'lib/db';

export async function getAllStudentByClassIdForPromotion(
  classId: string,
  sectionId?: string,
  groupId?: string
) {
  return db.studentMapping.findMany({
    where: {
      classId,
      isCurrent: true,
      ...(sectionId && { sectionId }),
      ...(groupId && { groupId }),
    },
    select: {
      student: {
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
        },
      },
      rollNumber: true,
    },
    orderBy: {
      rollNumber: 'asc',
    },
  });
}
