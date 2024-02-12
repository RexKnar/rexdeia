import { db } from '../../../lib/db';
import {
  CreateSectionModel,
  MapEntitiesToSectionModel,
  UpdateSectionModel,
} from '../../../lib/domain/section';

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
  return db.section.findFirst({
    where: {
      id: id,
      isActive: true,
    },
    include: {
      medium: true,
    },
  });
}

export async function getAllSectionsByClassId(classId: string) {
  return db.section.findMany({
    where: {
      classId: classId,
      isActive: true,
    },
  });
}

export async function mapSubjectsToSection(
  sectionId: string,
  subjectIds: string[]
) {
  await db.$transaction(
    subjectIds.map((subjectId) => {
      return db.section.update({
        where: {
          id: sectionId,
        },
        data: {
          sectionSubjects: {
            create: [{ subjectId: subjectId }],
          },
        },
      });
    })
  );
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

export async function unMapSubjectsFromSection(
  sectionId: string,
  entitiesToClassModels: MapEntitiesToSectionModel
) {
  const operations = entitiesToClassModels.entities.flatMap((entity) => {
    const ops = [];

    // If subjectId is provided, prepare to delete the corresponding SectionSubject entry
    if (entity.subjectId) {
      ops.push(
        db.sectionSubject.deleteMany({
          where: {
            sectionId: sectionId,
            subjectId: entity.subjectId,
          },
        })
      );
    }

    if (entity.staffId) {
      ops.push(
        db.staffSection.deleteMany({
          where: {
            sectionId: sectionId,
            staffId: entity.staffId,
          },
        })
      );
    }
    return ops;
  });

  await db.$transaction(operations);
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
  return db.section.update({
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
}

export async function addSection(createSection: CreateSectionModel) {
  return db.section.create({
    data: {
      name: createSection.name,
      isActive: createSection.isActive,
      classId: createSection.classId,
      mediumId: createSection.mediumId,
    },
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
