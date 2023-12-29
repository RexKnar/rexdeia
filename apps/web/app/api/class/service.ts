import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { CreateClassModel, UpdateClassModel } from '../../../lib/domain/class';

export async function getClassList(page: number, limit: number) {
  const session = await getServerSession(authOptions);
  const [ClassList, totalClasses] = await Promise.all([
    db.class.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        isActive: true,
        branchId: session.branchId,
      },
    }),
    db.class.count({
      where: {
        isActive: true,
        branchId: session.branchId,
      },
    }),
  ]);

  return {
    page,
    limit,
    data: ClassList,
    total: totalClasses,
  };
}

export async function getAllClassesByBatchId(batchId: string) {
  const session = await getServerSession(authOptions);
  return await db.class.findMany({
    where: {
      branchId: session.branchId,
      batchId: batchId,
      isActive: true,
    },
  });
}

export async function addClass(classPayload: CreateClassModel) {
  const session = await getServerSession(authOptions);
  return await db.class.create({
    data: {
      name: classPayload.name,
      description: classPayload.description,
      isActive: classPayload.isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
      batch: {
        connect: {
          id: classPayload.batchId,
        },
      },
      regulation: {
        connect: {
          id: classPayload.regulationId,
        },
      },
    },
  });
}

export async function deleteClassById(id: string) {
  const session = await getServerSession(authOptions);
  return await db.class.update({
    where: {
      id: id,
      branchId: session.branchId,
    },
    data: {
      isActive: false,
      updatedAt: new Date(),
    },
  });
}

export async function getClassById(id: string) {
  const session = await getServerSession(authOptions);
  return await db.class.findFirst({
    where: {
      id: id,
      branchId: session.branchId,
      isActive: true,
    },
  });
}

export async function updateClassById(
  id: string,
  updateClass: UpdateClassModel
) {
  const session = await getServerSession(authOptions);
  return await db.class.update({
    where: {
      id: id,
      branchId: session.branchId,
    },
    data: {
      ...updateClass,
    },
  });
}
