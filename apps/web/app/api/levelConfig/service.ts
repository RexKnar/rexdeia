import { db } from 'lib/db';
import { LevelConfigModel } from 'lib/domain/levelConfig';

export async function addLevelConfig(data: LevelConfigModel) {
  return await db.levelConfig.create({
    data: {
      name: data.name,
      isActive: data.isActive,
      classLevel: {
        connect: {
          id: data.classLevelId,
        },
      },
      noOfSubjects: data.noOfSubjects,
      noOfPeriods: data.noOfPeriods,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });
}

export async function getAllLevelConfig() {
  return await db.levelConfig.findMany({
    where: {
      isDeleted: false,
    },
  });
}

export async function updateLevelConfigById(
  id: string,
  data: LevelConfigModel
) {
  return await db.levelConfig.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      isActive: data.isActive,
      classLevel: {
        connect: {
          id: data.classLevelId,
        },
      },
      noOfSubjects: data.noOfSubjects,
      noOfPeriods: data.noOfPeriods,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });
}

export async function deleteLevelConfigById(id: string) {
  return await db.levelConfig.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });
}

export async function getLevelConfigById(id: string) {
  return await db.levelConfig.findFirst({
    where: {
      id: id,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
      classLevelId: true,
      noOfSubjects: true,
      noOfPeriods: true,
      startTime: true,
      endTime: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
