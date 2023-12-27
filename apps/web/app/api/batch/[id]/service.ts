import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { db } from '../../../../lib/db';
import {
  CreateBatchModel,
  UpdateBatchModel,
} from '../../../../lib/domain/batch';

export async function deleteBatchById(id: string) {
  const session = await getServerSession(authOptions);
  return db.batch.update({
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

export async function getBatchById(id: string) {
  const session = await getServerSession(authOptions);
  return db.batch.findFirst({
    where: {
      id: id,
      isDeleted: false,
      branchId: session.branchId,
    },
  });
}

export async function getAllBatches(page: number, limit: number) {
  const session = await getServerSession(authOptions);

  const [total, batchList] = await Promise.all([
    db.batch.count({
      where: {
        isActive: true,
        branchId: session.branchId,
      },
    }),
    db.batch.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        isDeleted: false,
        branchId: session.branchId,
      },
    }),
  ]);

  return {
    page,
    total,
    limit,
    data: batchList,
  };
}

export async function updateBatchById(
  id: string,
  updateBatch: UpdateBatchModel
) {
  const session = await getServerSession(authOptions);
  return db.batch.update({
    where: {
      id: id,
    },
    data: {
      name: updateBatch.name,
      description: updateBatch.description,
      startYear: updateBatch.startYear,
      endYear: updateBatch.endYear,
      isActive: updateBatch.isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function addBatch(createBatch: CreateBatchModel) {
  const session = await getServerSession(authOptions);
  return db.batch.create({
    data: {
      name: createBatch.name,
      endYear: createBatch.endYear,
      isActive: createBatch.isActive,
      startYear: createBatch.startYear,
      description: createBatch.description,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function addStudentsToBatch(
  batchId: string,
  studentIds: string[]
) {
  const session = await getServerSession(authOptions);
  return db.batch.update({
    where: {
      id: batchId,
      branchId: session.branchId,
    },
    data: {
      students: {
        connect: studentIds.map((id) => ({ id })),
      },
    },
  });
}

export async function addClassesToBatch(batchId: string, classIds: string[]) {
  const session = await getServerSession(authOptions);
  return db.batch.update({
    where: {
      id: batchId,
      branchId: session.branchId,
    },
    data: {
      class: {
        connect: classIds.map((id) => ({ id })),
      },
    },
  });
}
