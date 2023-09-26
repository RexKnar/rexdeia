import { db } from '../../../lib/db';
import { AddRegulationModel } from './models';

export async function getRegulationList({ organizationId, branchId }) {
  return await db.regulation.findMany({
    where: {
      isDeleted: false,
      organizationId: organizationId,
      branchId: branchId,
    },
  });
}

export async function addRegulation(regulation: AddRegulationModel) {
  return await db.regulation.create({
    data: {
      ...regulation,
      regulationName: regulation.regulationName,
      announcedYear: regulation.announcedYear,
      endYear: regulation.endYear,
      isActive: regulation.isActive,
    },
  });
}
