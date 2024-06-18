import { db } from 'lib/db';

export async function addCommunityCSV(payload: any) {
  const response = await db.$transaction(async (prisma) => {
    const promises = [];

    for (const community of payload) {
      if (community.name) {
        const promise = prisma.community.create({
          data: {
            name: community.name,
            isActive: community.isActive == 'TRUE' ? true : false,
          },
        });
        promises.push(promise);
      }
    }
    return Promise.all(promises);
  });
  return response.flat();
}
