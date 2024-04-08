import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
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
          name: true,
        },
      },
      term: {
        select: {
          name: true,
        },
      },
      batch: {
        select: {
          name: true,
        },
      },
    },
  });
}
