import { db } from 'lib/db';
import { PeriodModeModel } from 'lib/domain/periodMode';

export async function addPeriodMode(data: PeriodModeModel) {
  return await db.periodMode.create({
    data: {
      name: data.name,
      isActive: data.isActive,
      duration: data.duration,
    },
  });
}
export async function getAllPeriodMode() {
  return await db.periodMode.findMany({
    where: {
      isDeleted: false,
    },
  });
}
export async function getPeriodModeById(id: string) {
  return db.periodMode.findFirst({
    where: {
      id: id,
    },
  });
}
export async function updatePeriodModeById(id: string, data: PeriodModeModel) {
  return await db.periodMode.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      isActive: data.isActive,
    },
  });
}

export async function deletePeriodModeById(id: string) {
  return await db.periodMode.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });
}
