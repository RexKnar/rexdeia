import { db } from '../../../lib/db';
import {
  CreateSectionModel,
  UpdateSectionModel,
} from '../../../lib/domain/section';

export async function deleteSectionById(id: string) {
  return await db.section.update({
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
  return await db.section.findFirst({
    where: {
      id: id,
      isActive: true,
    },
  });
}

export async function getAllSectionsByClassId(classId: string) {
  return await db.section.findMany({
    where: {
      classId: classId,
      isActive: true,
    },
  });
}

export async function updateSectionById(
  id: string,
  updateSection: UpdateSectionModel
) {
  return await db.section.update({
    where: {
      id: id,
    },
    data: {
      name: updateSection.name,
      medium: updateSection.medium,
      description: updateSection.description,
      faculty: updateSection.faculty,
      isActive: updateSection.isActive,
      classId: updateSection.classId,
    },
  });
}

export async function addSection(createSection: CreateSectionModel) {
  return await db.section.create({
    data: {
      name: createSection.name,
      medium: createSection.medium,
      isActive: createSection.isActive,
      class: {
        connect: {
          id: createSection.classId,
        },
      },
    },
  });
}

export async function addStudentsToSection(
  sectionId: string,
  studentIds: string[]
) {
  return await db.section.update({
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
  return await db.section.update({
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

export async function addSubjectsToSection(
  sectionId: string,
  subjectIds: string[]
) {
  return await db.section.update({
    where: {
      id: sectionId,
    },
    data: {
      subjects: {
        connect: subjectIds.map((id) => ({ id })),
      },
    },
  });
}
