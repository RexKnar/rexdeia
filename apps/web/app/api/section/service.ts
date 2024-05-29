import { db } from '../../../lib/db';
import {
  CreateSectionModel,
  MapEntitiesToSectionModel,
  UpdateSectionModel,
} from '../../../lib/domain/section';

type SectionFilter = {
  isActive?: boolean;
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
  const sectionDetails = await db.section.findFirst({
    where: {
      id: id,
      isActive: true,
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
  sectionDetails['group'] = sectionDetails.sectionToGroups.map((item) => {
    return item.group;
  });
  delete sectionDetails.sectionToGroups;
  return sectionDetails;
}

export async function getAllSectionsByClassId(classId: string) {
  return db.section.findMany({
    where: {
      classId: classId,
    },
  });
}

export async function getSectionsWithFilter(
  classId: string,
  filter: SectionFilter
) {
  const { isActive } = filter;

  const whereClause = {
    classId: classId,
    isDeleted: false,
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
    }),
  ]);
  return { total, data };
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
    // If staffId is provided, prepare to delete the corresponding SectionSubject entry
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
  return await db.$transaction(async (prisma) => {
    const createdSection = await prisma.section.create({
      data: {
        name: sectionDetails.name,
        isActive: sectionDetails.isActive,
        classId: sectionDetails.classId,
        mediumId: sectionDetails.mediumId,
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
      },
    },
    select: {
      section: true,
    },
  });
  const response = sections.map((section) => section.section);
  return response;
}
