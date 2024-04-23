import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { CreateExamTypeModel, UpdateExamTypeModel } from 'lib/domain/exam';
import { getServerSession } from 'next-auth';

export async function createExamType(payload: CreateExamTypeModel) {
  const { name, isActive, frequencyId } = payload;

  const session = await getServerSession(authOptions);

  return db.examType.create({
    data: {
      name: name,
      isActive: isActive,
      frequencyId: frequencyId,
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
        frequencyId: true,
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

export async function updateExamTypeById(
  id: string,
  updateExamTypePayload: UpdateExamTypeModel
) {
  return db.examType.update({
    where: {
      id: id,
    },
    data: {
      name: updateExamTypePayload.name,
      isActive: updateExamTypePayload.isActive,
    },
  });
}

export async function getExamTypeById(id: string) {
  const session = await getServerSession(authOptions);
  return db.examType.findFirst({
    where: {
      id: id,
      branchId: session.branchId,
    },
  });
}
