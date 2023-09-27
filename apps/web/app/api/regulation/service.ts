import { db } from '../../../lib/db';

export async function getRegulationList({ organizationId, branchId }) {
  return await db.regulation.findMany({
    where: {
      isDeleted: false,
      organizationId: organizationId,
      branchId: branchId,
    },
  });
}
