import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import {
  CreateMediumModel,
  UpdateMediumModel,
} from '../../../lib/domain/medium';

export async function getAllMediums(
  page: number,
  limit: number,
  status: string
) {
  const session = await getServerSession(authOptions);

  const [total, mediumList] = await Promise.all([
    db.medium.count({
      where: {
        isActive: Boolean(status),
        branchId: session.branchId,
      },
    }),
    db.medium.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        branchId: session.branchId,
        isActive: Boolean(status),
        isDeleted: false,
      },
    }),
  ]);

  return {
    page,
    total,
    limit,
    data: mediumList,
  };
}

export async function addMedium(createMediumPayload: CreateMediumModel) {
  const session = await getServerSession(authOptions);
  return db.medium.create({
    data: {
      name: createMediumPayload.name,
      isActive: createMediumPayload.isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function updateMediumById(
  id: string,
  updateMediumPayload: UpdateMediumModel
) {
  const session = await getServerSession(authOptions);
  return db.medium.update({
    where: {
      id: id,
    },
    data: {
      name: updateMediumPayload.name,
      isActive: updateMediumPayload.isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function getMediumById(id: string) {
  const session = await getServerSession(authOptions);
  return db.medium.findFirst({
    where: {
      id: id,
      isDeleted: false,
      branchId: session.branchId,
    },
  });
}

export async function deleteMediumById(id: string) {
  const session = await getServerSession(authOptions);
  return db.medium.update({
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
