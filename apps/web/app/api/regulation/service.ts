import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { RegulationModel } from '../../../lib/domain/regulation';

export async function getRegulationList({ branchId }) {
  return await db.regulation.findMany({
    where: {
      isDeleted: false,
      branchId: branchId,
    },
  });
}

export async function addRegulation(regulation: RegulationModel) {
  const session = await getServerSession(authOptions);
  return await db.regulation.create({
    data: {
      ...regulation,
      endYear: regulation.endYear,
      isActive: regulation.isActive,
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
  return await db.regulation.update({
    where: {
      id: regulationId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
}
