import { db } from '../../../../lib/db';

export async function getOrganisationsByUserId(userId: string) {
  return await db.userOrganization.findMany({
    where: {
      userId: userId,
    },
    include: {
      branch: true,
      organization: true,
    },
  });
}
