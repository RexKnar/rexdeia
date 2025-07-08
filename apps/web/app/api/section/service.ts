import { authOptions } from 'lib/auth';
import uniqBy from 'lodash/uniqBy';
import { getServerSession } from 'next-auth';

import { db } from '../../../lib/db';
import {
  CreateSectionModel,
  MapEntitiesToSectionModel,
  UpdateSectionModel,
} from '../../../lib/domain/section';

type SectionFilter = {
  isActive?: boolean;
  requestAcademicYearId?: string;
};

export async function deleteSectionById(id: string) {
  return db.section.update({
    where: {
      id: id,
    },
    data: {
      isActive: false,
      updatedAt: new Date(),
    },
  });
}

export async function getSectionById(id: string) {
  const session = await getServerSession(authOptions);
  const academicYearId = session.currentBatch;
  const sectionDetails = await db.section.findFirst({
    where: {
      id: id,
      academicYearId: academicYearId,
    },
    include: {
      medium: true,
      sectionToGroups: {
        select: {
          group: true,
        },
      },
    },
  });
  if (sectionDetails?.sectionToGroups) {
    sectionDetails['group'] = sectionDetails.sectionToGroups.map((item) => {
      return item.group;
    });
    delete sectionDetails.sectionToGroups;
  }
  return sectionDetails;
}

export async function getAllSectionsByClassId(classId: string) {
  const session = await getServerSession(authOptions);
  const academicYearId = session.currentBatch;
  return db.section.findMany({
    where: {
      classId: classId,
      academicYearId: academicYearId,
    },
  });
}

export async function getSectionsWithFilter(
  classId: string,
  filter: SectionFilter & { academicYearId?: string }
) {
  const session = await getServerSession(authOptions);

  const { isActive, requestAcademicYearId } = filter;
  const academicYearId = requestAcademicYearId ?? session.currentBatch;

  if (!academicYearId) {
    throw new Error('No active academic year found');
  }

  const whereClause = {
    classId,
    isDeleted: false,
    academicYearId: academicYearId,
  };

  if (isActive !== undefined) {
    whereClause['isActive'] = isActive;
  }

  const [total, data] = await db.$transaction([
    db.section.count({
      where: whereClause,
    }),
    db.section.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        academicSubjectForStaff: {
          where: {
            academicYearId,
            deletedAt: null,
            isIncharge: true,
          },
          select: {
            staff: {
              select: {
                id: true,
                firstName: true,
                middleName: true,
                lastName: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const transformedData = data.map((section) => ({
    ...section,
    staffIncharges: section.academicSubjectForStaff.map((item) => item.staff),
  }));

  return { total, data: transformedData };
}

export async function mapStaffsToSection(
  sectionId: string,
  entitiesToClassModels: MapEntitiesToSectionModel
) {
  await db.$transaction(
    entitiesToClassModels.entities.map((entity) => {
      const updateData = {
        staffSections: {},
        sectionSubjects: {},
      };
      if (entity.staffId) {
        updateData.staffSections = {
          create: [
            {
              staffId: entity.staffId,
            },
          ],
        };
      }

      if (entity.subjectId) {
        updateData.sectionSubjects = {
          create: [
            {
              subjectId: entity.subjectId,
            },
          ],
        };
      }

      return db.section.update({
        where: {
          id: sectionId,
        },
        data: updateData,
      });
    })
  );
}

export async function unMapStaffsFromSection(
  sectionId: string,
  staffIds: string[]
) {
  const operations = staffIds.flatMap((staffId) => {
    const ops = [];
    if (staffId) {
      ops.push(
        db.staffSection.deleteMany({
          where: {
            sectionId: sectionId,
            staffId: staffId,
          },
        })
      );
    }
    return ops;
  });

  await db.$transaction(operations);
}

export async function updateSectionById(
  id: string,
  updateSection: UpdateSectionModel
) {
  return db.$transaction(async (prisma) => {
    const updatedSection = await prisma.section.update({
      where: {
        id: id,
      },
      data: {
        name: updateSection.name,
        description: updateSection.description,
        faculty: updateSection.faculty,
        isActive: updateSection.isActive,
        classId: updateSection.classId,
        mediumId: updateSection.mediumId,
      },
    });

    await prisma.sectionToGroups.deleteMany({
      where: {
        sectionId: id,
      },
    });

    await Promise.all(
      updateSection.groupIds.map(async (groupId) => {
        await prisma.sectionToGroups.create({
          data: {
            groupId: groupId,
            sectionId: updatedSection.id,
          },
        });
      })
    );

    return updatedSection;
  });
}

export async function addSection(sectionDetails: CreateSectionModel) {
  const session = await getServerSession(authOptions);
  const academicYearId = session.currentBatch;
  return await db.$transaction(async (prisma) => {
    const createdSection = await prisma.section.create({
      data: {
        name: sectionDetails.name,
        isActive: sectionDetails.isActive,
        classId: sectionDetails.classId,
        mediumId: sectionDetails.mediumId,
        academicYearId: academicYearId,
      },
    });
    return sectionDetails.groupIds.map(async (groupId) => {
      return await db.section.update({
        where: {
          id: createdSection.id,
        },
        data: {
          sectionToGroups: {
            create: [{ groupId: groupId }],
          },
        },
      });
    });
  });
}

export async function addStudentsToSection(
  sectionId: string,
  studentIds: string[]
) {
  return db.section.update({
    where: {
      id: sectionId,
    },
    data: {
      students: {
        connect: studentIds.map((id) => ({ id })),
      },
    },
  });
}

export async function removeStudentsFromSection(
  sectionId: string,
  studentIds: string[]
) {
  return db.section.update({
    where: {
      id: sectionId,
    },
    data: {
      students: {
        disconnect: studentIds.map((id) => ({ id })),
      },
    },
  });
}

export async function getSectionsBySubjectIdClassId(filter: {
  classId: string;
  subjectId: string;
}) {
  const session = await getServerSession(authOptions);
  const groups = await db.subjectToGroup.findMany({
    where: {
      subjectId: filter.subjectId,
      classId: filter.classId,
    },
  });

  const groupIds = groups.map((group) => group.groupId);
  if (groupIds.length === 0) {
    return [];
  }

  const sections = await db.sectionToGroups.findMany({
    where: {
      groupId: {
        in: groupIds,
      },
      section: {
        classId: filter.classId,
        academicYearId: session.currentBatch,
      },
    },
    select: {
      section: true,
    },
  });
  const response = sections.map((section) => section.section);
  return uniqBy(response, (response) => response.id);
}
