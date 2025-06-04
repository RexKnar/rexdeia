import { db } from 'lib/db';
import { PromoteStudentsToNewClassModel } from 'lib/domain/student';

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

export async function promoteStudentToNewClass(
  payload: PromoteStudentsToNewClassModel
) {
  return await db.$transaction(
    payload.studentIds.map((studentId) =>
      db.studentMapping.create({
        data: {
          studentId: studentId,
          classId: payload.classId,
          sectionId: payload.sectionId,
          groupId: payload.groupId,
          batchId: payload.academicYear,
          mediumId: payload.mediumId,
          isCurrent: true,
        },
      })
    )
  );
}

export async function archiveStudents(
  studentIds: string[],
  remark = 'Passed Out'
) {
  return await db.$transaction(
    studentIds.map((studentId) =>
      db.studentMapping.updateMany({
        where: {
          studentId,
          isCurrent: true,
        },
        data: {
          isCurrent: false,
          remark,
        },
      })
    )
  );
}
