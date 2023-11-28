import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { CreateClassModel } from '../../../lib/domain/class';

export async function getClassList() {
  const session = await getServerSession(authOptions);
  return await db.class.findMany({
    where: {
      branchId: session.branchId,
    },
  });
}

export async function addClass(classPayload: CreateClassModel) {
  const session = await getServerSession(authOptions);
  return await db.class.create({
    data: {
      ...classPayload,
      name: classPayload.name,
      isActive: classPayload.isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}
