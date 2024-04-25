import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { CreateTermModel, UpdateTermModel } from 'lib/domain/exam';
import { getServerSession } from 'next-auth';

export async function getAllTerms(page: number, limit: number) {
  const { branchId } = await getServerSession(authOptions);
  const whereClause = {
    branchId,
    isDeleted: false,
  };

  const [total, data] = await db.$transaction([
    db.term.count({
      where: whereClause,
    }),
    db.term.findMany({
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

export async function createTerm(payload: CreateTermModel) {
  const { name, isActive } = payload;

  const session = await getServerSession(authOptions);

  return db.term.create({
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

export async function getTermById(id: string) {
  const session = await getServerSession(authOptions);
  return db.term.findFirst({
    where: {
      id: id,
      isDeleted: false,
      branchId: session.branchId,
    },
  });
}

export async function updateTermById(id: string, payload: UpdateTermModel) {
  const session = await getServerSession(authOptions);
  const { name, isActive } = payload;
  return db.term.update({
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

export async function deleteTermById(id: string) {
  const session = await getServerSession(authOptions);

  return db.term.update({
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
