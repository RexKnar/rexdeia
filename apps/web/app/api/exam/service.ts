import { authOptions } from 'lib/auth';
import { CreateExamModel } from 'lib/domain/exam';
import { getServerSession } from 'next-auth';

import { db } from '../../../lib/db';

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

export async function createExam(examPayload: CreateExamModel) {
  const session = await getServerSession(authOptions);
  const { name, examTypeId, termId, academicYearId } = examPayload;

  const [examType, term, academicYear] = await db.$transaction([
    db.examType.findUnique({ where: { id: examTypeId } }),
    db.term.findUnique({ where: { id: termId } }),
    db.batch.findUnique({ where: { id: academicYearId } }),
  ]);

  if (!examType) {
    throw new Error(`EXAM_TYPE_NOT_FOUND`);
  }
  if (!term) {
    throw new Error(`TERM_NOT_FOUND`);
  }
  if (!academicYear) {
    throw new Error(`ACADEMIC_YEAR_NOT_FOUND`);
  }

  return await db.$transaction(async (prisma) => {
    const createdExam = await prisma.exam.create({
      data: {
        name: name,
        isActive: true,
        branch: {
          connect: {
            id: session.branchId,
          },
        },
        examType: {
          connect: {
            id: examTypeId,
          },
        },
        term: {
          connect: {
            id: term.id,
          },
        },
        batch: {
          connect: {
            id: academicYearId,
          },
        },
      },
    });
    return createdExam;
  });
}
