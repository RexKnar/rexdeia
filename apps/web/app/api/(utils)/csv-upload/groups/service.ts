import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { toTitleCase } from 'lib/utils/formatters';
import { getServerSession } from 'next-auth';

export async function addGroupCSV(payload: any) {
  const session = await getServerSession(authOptions);
  const response = await db.$transaction(async (prisma) => {
    const promises = [];

    for (const group of payload) {
      if (group.name) {
        const promise = prisma.group.create({
          data: {
            name: toTitleCase(group.name),
            isActive: group.isActive == 'TRUE' ? true : false,
            branch: {
              connect: {
                id: session.branchId,
              },
            },
          },
        });
        promises.push(promise);
      }
    }
    return Promise.all(promises);
  });
  return response.flat();
}
