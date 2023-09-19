import { db } from '../../../../lib/db';
import { BranchModel } from './models';

export async function updateBranchById(id: string, branch: BranchModel) {
  return await db.branch.update({
    data: {
      isActivated: true,
      name: branch.name,
    },
    where: {
      id: id,
    },
  });
}

export async function getBranchById(id: string) {
  return await db.branch.findUnique({
    where: {
      id: id,
    },
  });
}
