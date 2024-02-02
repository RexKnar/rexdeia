import { db } from '../../../lib/db';
import {
  CreateSectionModel,
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

export async function addStaffsToSection(
  sectionId: string,
  staffIds: string[]
) {
  return db.section.update({
    where: {
      id: sectionId,
    },
    data: {
      staff: {
        connect: staffIds.map((id) => ({ id })),
      },
    },
  });
}
