import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { PromoteStudentsToNewClassModel } from 'lib/domain/student';
import { getServerSession } from 'next-auth';

export async function getAllStudentByClassIdForPromotion(
  classId: string,
  sectionId?: string,
  groupId?: string
) {
  const session = await getServerSession(authOptions);
  return db.studentMapping.findMany({
    where: {
      classId,
      batchId: session.currentBatch,
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

export async function updateStudentStatus(
  studentIds: string[],
  data: {
    isCurrent: boolean;
    onHold?: boolean;
    remark?: string;
  }
) {
  return await db.$transaction(
    studentIds.map((studentId) =>
      db.studentMapping.updateMany({
        where: {
          studentId,
          isCurrent: true,
        },
        data,
      })
    )
  );
}
