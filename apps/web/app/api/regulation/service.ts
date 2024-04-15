import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import {
  RegulationModel,
  UpdateRegulationModel,
} from '../../../lib/domain/regulation';

type RegulationFilter = {
  isActive?: boolean;
};

export async function getRegulationList(page: number, limit: number) {
  const session = await getServerSession(authOptions);
  const [regulationsList, totalRegulations] = await Promise.all([
    db.regulation.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        isDeleted: false,
        branchId: session.branchId,
      },
    }),
    db.regulation.count({
      where: {
        isDeleted: false,
        branchId: session.branchId,
      },
    }),
  ]);

  return {
    page,
    limit,
    data: regulationsList,
    total: totalRegulations,
  };
}

export async function getRegulationById(id: string) {
  return await db.regulation.findUnique({
    where: {
      id: id,
    },
  });
}

export async function addRegulation(regulation: RegulationModel) {
  const session = await getServerSession(authOptions);
  return db.regulation.create({
    data: {
      regulationName: regulation.regulationName,
      isActive: regulation.isActive,
      announcedYear: regulation.announcedYear,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function updateRegulationById(
  regulationId: string,
  regulation: UpdateRegulationModel
) {
  const session = await getServerSession(authOptions);

  return await db.regulation.update({
    data: {
      regulationName: regulation.regulationName,
      isActive: regulation.isActive,
      announcedYear: regulation.announcedYear,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
    where: {
      id: regulationId,
    },
  });
}
export async function deleteRegulation(regulationId: string) {
  return db.regulation.update({
    where: {
      id: regulationId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
}

export async function getRegulationsWithFilter(
  page: number,
  limit: number,
  filter: RegulationFilter
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
    db.regulation.count({
      where: whereClause,
    }),
    db.regulation.findMany({
      take: limit,
      where: whereClause,
      skip: (page - 1) * limit,
      select: {
        id: true,
        regulationName: true,
        isActive: true,
        announcedYear: true,
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
