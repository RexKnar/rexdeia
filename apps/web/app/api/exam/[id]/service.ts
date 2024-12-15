import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { UpdateExamModel } from 'lib/domain/exam';
// import { UpdateExamModel } from 'lib/domain/exam';
import { getServerSession } from 'next-auth';

export async function getExamById(examId: string) {
  const session = await getServerSession(authOptions);

  return db.exam.findFirst({
    where: {
      branchId: session.branchId,
      isDeleted: false,
      id: examId,
    },
    include: {
      examType: {
        select: {
          id: true,
          name: true,
        },
      },
      term: {
        select: {
          id: true,
          name: true,
        },
      },
      batch: {
        select: {
          id: true,
          name: true,
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

export async function updateExamById(id: string, payload: UpdateExamModel) {
  const session = await getServerSession(authOptions);
  const { name, isActive } = payload;
  return db.exam.update({
    where: {
      id: id,
    },
    data: {
      name,
      isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function deleteExamById(id: string) {
  const session = await getServerSession(authOptions);

  return db.exam.update({
    where: {
      id: id,
      branchId: session.branchId,
    },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
}
