import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function copySections(payload: any) {
  const { classId, academicYearId: sourceAcademicYearId } = payload;
  const session = await getServerSession(authOptions);

  const oldSections = await db.section.findMany({
    where: {
      classId: classId,
      academicYearId: sourceAcademicYearId,
    },
    include: {
      sectionToGroups: true,
    },
  });

  try {
    return await db.$transaction(async (prisma) => {
      for (const sectionDetails of oldSections) {
        const createdSection = await prisma.section.create({
          data: {
            name: sectionDetails.name,
            isActive: sectionDetails.isActive,
            classId: sectionDetails.classId,
            mediumId: sectionDetails.mediumId,
            academicYearId: session.currentBatch,
          },
        });

        await Promise.all(
          sectionDetails.sectionToGroups.map(async (group) => {
            return prisma.section.update({
              where: {
                id: createdSection.id,
              },
              data: {
                sectionToGroups: {
                  create: [{ groupId: group.groupId }],
                },
              },
            });
          })
        );
      }
    });
  } catch (e) {
    return e;
  }
}
