import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function addClassCSV(classDatas: any) {
  try {
    const promises = [classDatas];
    const session = await getServerSession(authOptions);
    for (const classData of classDatas) {
      let classDetail = null;
      if (classData.Class) {
        classDetail = await db.class.findFirst({
          where: {
            name: classData.Class,
          },
        });

        const groupDetail = await db.group.findFirst({
          where: {
            name: classData.Group,
          },
        });
        const mediumDetail = await db.medium.findFirst({
          where: {
            name: classData.Medium,
          },
        });

        if (!classDetail) {
          classDetail = await db.class.create({
            data: {
              name: classData.Class,
              isActive: true,
              branch: {
                connect: {
                  id: session.branchId,
                },
              },
            },
          });
        }
        let sectionDetail = await db.section.findFirst({
          where: {
            name: classData.Section,
            classId: classDetail.id,
          },
        });
        if (!sectionDetail) {
          sectionDetail = await db.section.create({
            data: {
              name: classData.Section,
              isActive: true,
              classId: classDetail.id,
              mediumId: mediumDetail.id,
              sectionToGroups: {
                create: [{ groupId: groupDetail.id }],
              },
            },
          });
          classDetail['section'] = [sectionDetail];

          promises.push(classDetail);
        }
      }
    }

    return promises;
  } catch (e) {
    return e;
  }
}
