import { db } from 'lib/db';
import { PeriodMasterModel } from 'lib/domain/periodMaster';

export async function addPeriodMaster(data: PeriodMasterModel) {
  return await db.periodMaster.create({
    data: {
      name: data.name,
      order: data.order,
      isActive: data.isActive,
      periods: {
        connect: {
          id: data.periodsId,
        },
      },
      classLevel: {
        connect: {
          id: data.classLevelId,
        },
      },
    },
  });
}

export async function getAllPeriodMaster() {
  return await db.periodMaster.findMany({
    where: {
      isDeleted: false,
    },
  });
}
export async function getPeriodMasterById(id: string) {
  return db.periodMaster.findFirst({
    where: {
      id: id,
    },
  });
}
export async function updatePeriodMasterById(
  id: string,
  data: PeriodMasterModel
) {
  return await db.periodMaster.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      order: data.order,
      isActive: data.isActive,
      periods: {
        connect: {
          id: data.periodsId,
        },
      },
      classLevel: {
        connect: {
          id: data.classLevelId,
        },
      },
    },
  });
}

export async function deletePeriodMasterById(id: string) {
  return await db.periodMaster.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });
}
