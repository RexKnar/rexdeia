import { db } from 'lib/db';
import { ClassLevelModel } from 'lib/domain/classLevel';

export async function addClassLevel(data: ClassLevelModel) {
  return await db.classLevel.create({
    data: {
      name: data.name,
      class: {
        connect: {
          id: data.classId,
        },
      },
      isActive: data.isActive,
    },
  });
}

export async function getAllClassLevel() {
  return await db.classLevel.findMany({
    where: {
      isDeleted: false,
    },
  });
}

export async function updateClassLevelById(id: string, data: ClassLevelModel) {
  return await db.classLevel.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      class: {
        connect: {
          id: data.classId,
        },
      },
      isActive: data.isActive,
    },
  });
}

export async function deleteClassLevelById(id: string) {
  return await db.classLevel.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });
}

export async function getClassLevelById(id: string) {
  return await db.classLevel.findFirst({
    where: {
      id: id,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
      classId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
