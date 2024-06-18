import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { toTitleCase } from 'lib/utils/formatters';
import { getServerSession } from 'next-auth';

export async function addSubjectMasterCSV(payload: any) {
  const session = await getServerSession(authOptions);
  const response = await db.$transaction(async (prisma) => {
    const promises = [];

    for (const subjectMaster of payload) {
      if (subjectMaster.name) {
        const promise = prisma.subjectMaster.create({
          data: {
            name: toTitleCase(subjectMaster.name),
            isActive: subjectMaster.isActive == 'TRUE' ? true : false,
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
