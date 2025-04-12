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
          profileImage: true,
        },
      },
      rollNumber: true,
    },
    orderBy: {
      rollNumber: 'asc',
    },
  });
}

export async function promoteStudentToNewClass(payload: {
  studentIds: string[];
  ClassId: string;
  SectionId: string;
  GroupId: string;
  AcademicYear: string;
}) {
  return await db.$transaction(
    payload.studentIds.map((studentId) =>
      db.student.update({
        where: {
          id: studentId,
        },
        data: {
          studentMapping: {
            updateMany: [
              {
                where: {
                  studentId: studentId,
                },
                data: {
                  classId: payload.ClassId,
                  sectionId: payload.SectionId,
                  groupId: payload.GroupId,
                  batchId: payload.AcademicYear,
                },
              },
            ],
          },
        },
      })
    )
  );
}
