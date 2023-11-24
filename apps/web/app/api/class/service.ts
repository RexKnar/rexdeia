import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';

export async function addClass(classPayload) {
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
