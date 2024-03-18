import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { CreateExamModel } from 'lib/domain/exam';
import { getServerSession } from 'next-auth';

export async function createExamType(payload: CreateExamModel) {
  const { name, termId } = payload;

  const term = await db.term.findUnique({ where: { id: termId } });

  if (!term) {
    throw new Error(`TERM_NOT_FOUND`);
  }

  const session = await getServerSession(authOptions);

  return db.examType.create({
    data: {
      name: name,
      isActive: true,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
      term: {
        connect: {
          id: term.id,
        },
      },
    },
  });
}
