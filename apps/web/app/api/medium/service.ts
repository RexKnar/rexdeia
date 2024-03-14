import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import {
  CreateMediumRequestModel,
  UpdateMediumRequestModel,
} from '../../../lib/domain/medium';

type MediumFilter = {
  isActive?: boolean;
};

export async function getAllMediums(page: number, limit: number) {
  const { branchId } = await getServerSession(authOptions);

  const whereClause = {
    isDeleted: false,
    branchId,
  };

  const [total, data] = await db.$transaction([
    db.medium.count({
      where: whereClause,
    }),
    db.medium.findMany({
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

export async function getMediumsWithFilter(
  page: number,
  limit: number,
  filter: MediumFilter
) {
  const { isActive } = filter;
  const { branchId } = await getServerSession(authOptions);

  const whereClause = {
    branchId,
    isDeleted: false,
  };

  if (isActive !== undefined) {
    whereClause['isActive'] = isActive;
  }

  const [total, data] = await db.$transaction([
    db.medium.count({
      where: whereClause,
    }),
    db.medium.findMany({
      take: limit,
      where: whereClause,
      skip: (page - 1) * limit,
      select: {
        id: true,
        name: true,
        isActive: true,
        updatedAt: true,
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

export async function addMedium(payload: CreateMediumRequestModel) {
  const session = await getServerSession(authOptions);
  const { name, isActive } = payload;

  return db.medium.create({
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

export async function updateMediumById(
  id: string,
  payload: UpdateMediumRequestModel
) {
  const session = await getServerSession(authOptions);
  const { name, isActive } = payload;

  return db.medium.update({
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

export async function getMediumById(id: string) {
  const session = await getServerSession(authOptions);

  return db.medium.findFirst({
    where: {
      id: id,
      isDeleted: false,
      branchId: session.branchId,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
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
