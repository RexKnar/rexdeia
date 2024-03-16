import { authOptions } from 'lib/auth';
import { getServerSession } from 'next-auth';

import { db } from '../../../lib/db';
import { CreateExamModel } from '../../../lib/domain/exam';

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

export async function getExamsList(page: number, limit: number) {
  const session = await getServerSession(authOptions);
  const [data, total] = await db.$transaction([
    db.exam.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        branchId: session.branchId,
      },
      include: {
        class: true,
        subject: true,
        examType: true,
        section: true,
        batch: true,
        examConfiguration: {
          include: {
            assessmentFormat: true,
          },
        },
      },
    }),
    db.exam.count({
      where: {
        branchId: session.branchId,
      },
    }),
  ]);

  return {
    page,
    total,
    limit,
    data,
  };
}
