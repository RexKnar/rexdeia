import { db } from '../../../lib/db';

export async function getAdmissionList(
  pageValue: number,
  tablePaginationLimit: number
) {
  return await db.admissionForm.findMany({
    skip: pageValue,
    take: tablePaginationLimit,
  });
}

const firstNames = 'o';

export async function admissionListDemo() {
  const demo = await db.admissionForm.findMany({
    where: {
      firstName: {
        contains: firstNames,
        mode: 'insensitive',
      },
    },
  });
  console.log(`demooooo----->${JSON.stringify(demo)}`);
}

admissionListDemo();
// console.log(`demooooo----->${JSON.stringify(demo)}`);
