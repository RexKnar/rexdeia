import { db } from 'lib/db';

export async function addLanguageCSV(payload: any) {
  const response = await db.$transaction(async (prisma) => {
    const promises = [];

    for (const language of payload) {
      if (language.name) {
        const promise = prisma.language.create({
          data: {
            name: language.name,
            isActive: language.isActive == 'TRUE' ? true : false,
          },
        });
        promises.push(promise);
      }
    }
    return Promise.all(promises);
  });
  return response.flat();
}
