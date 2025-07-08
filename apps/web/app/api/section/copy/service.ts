import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

export async function copySections(payload: {
  classId: string;
  academicYearId: string;
}) {
  const { classId, academicYearId: sourceAcademicYearId } = payload;
  const session = await getServerSession(authOptions);

  if (!session?.currentBatch) {
    throw new Error('Missing current academicYearId in session');
  }

  const oldSections = await db.section.findMany({
    where: {
      classId,
      academicYearId: sourceAcademicYearId,
    },
    include: {
      sectionToGroups: true,
    },
  });

  if (oldSections.length === 0) {
    return [];
  }

  return await db.$transaction(async (prisma) => {
    const copied = [];

    for (const oldSection of oldSections) {
      const createdSection = await prisma.section.create({
        data: {
          name: oldSection.name,
          isActive: oldSection.isActive,
          classId: oldSection.classId,
          mediumId: oldSection.mediumId,
          academicYearId: session.currentBatch,
          sectionToGroups: {
            create: oldSection.sectionToGroups.map((group) => ({
              groupId: group.groupId,
            })),
          },
        },
      });

      copied.push(createdSection);
    }

    return copied;
  });
}
