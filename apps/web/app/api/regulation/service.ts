import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { RegulationModel } from '../../../lib/domain/regulation';

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

export async function addRegulation(regulation: RegulationModel) {
  const session = await getServerSession(authOptions);
  return db.regulation.create({
    data: {
      ...regulation,
      isActive: true,
      endYear: regulation.endYear,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
      announcedYear: regulation.announcedYear,
      regulationName: regulation.regulationName,
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
