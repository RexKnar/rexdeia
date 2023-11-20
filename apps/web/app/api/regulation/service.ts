import { db } from '../../../lib/db';
import { AddRegulationModel } from './models';

export async function getRegulationList({ branchId }) {
  return await db.regulation.findMany({
    where: {
      isDeleted: false,
      branchId: branchId,
    },
  });
}

export async function addRegulation(regulation: AddRegulationModel) {
  return await db.regulation.create({
    data: {
      ...regulation,
      endYear: regulation.endYear,
      isActive: regulation.isActive,
      branchId: regulation.branchId,
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
