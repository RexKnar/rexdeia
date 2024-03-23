import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { CreateExamTypeModel } from 'lib/domain/exam';
import { getServerSession } from 'next-auth';

export async function createExamType(payload: CreateExamTypeModel) {
  const { name, isActive } = payload;

  const session = await getServerSession(authOptions);

  return db.examType.create({
    data: {
      name: name,
      isActive: isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function getAllExamTypes(page: number, limit: number) {
  const { branchId } = await getServerSession(authOptions);
  const whereClause = {
    branchId,
  };

  const [total, data] = await db.$transaction([
    db.examType.count({
      where: whereClause,
    }),
    db.examType.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: whereClause,
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
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
