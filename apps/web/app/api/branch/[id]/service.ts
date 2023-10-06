import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { db } from '../../../../lib/db';
import { UpdateBranchByIdModel } from '../../../../lib/domain';

export async function updateBranchById(
  id: string,
  branch: UpdateBranchByIdModel
) {
  const session = await getServerSession(authOptions);

  return await db.branch.update({
    data: {
      ...branch,
      isActivated: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: {
        connect: {
          id: session.user.id,
        },
      },
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
