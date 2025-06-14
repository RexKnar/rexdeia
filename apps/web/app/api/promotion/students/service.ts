import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { PromoteStudentsToNewClassModel } from 'lib/domain/student';
import { getServerSession } from 'next-auth';

export async function getAllStudentByClassIdForPromotion(
  classId: string,
  sectionId?: string,
  groupId?: string,
  status?: string
) {
  const session = await getServerSession(authOptions);

  let where: any = {
    classId,
    batchId: session.currentBatch,
    isCurrent: true,
  };

  if (sectionId) where.sectionId = sectionId;
  if (groupId) where.groupId = groupId;

  if (status === 'archive') {
    where.isCurrent = false;
  }

  return db.studentMapping.findMany({
    where,
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
      isCurrent: true,
      batchId: true,
    },
    orderBy: {
      rollNumber: 'asc',
    },
  });
}

export async function promoteStudentToNewClass(
  payload: PromoteStudentsToNewClassModel
) {
  return await db.$transaction([
    ...payload.studentIds.map((studentId) =>
      db.studentMapping.create({
        data: {
          studentId,
          classId: payload.classId,
          sectionId: payload.sectionId,
          groupId: payload.groupId,
          batchId: payload.academicYear,
          mediumId: payload.mediumId,
          isCurrent: true,
        },
      })
    ),
  ]);
}

export async function updateStudentStatus(
  studentIds: string[],
  data: {
    isCurrent: boolean;
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
