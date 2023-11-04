import { db } from '../../../lib/db';

export async function getUserDetailsById(userId: string) {
  return await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      userOrganizations: {
        include: {
          branch: true,
          organization: true,
        },
      },
    },
  });
}
