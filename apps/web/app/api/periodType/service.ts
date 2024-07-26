import { db } from 'lib/db';
import { PeriodTypeModel } from 'lib/domain/periodsType';

export async function addPeriodType(data: PeriodTypeModel) {
  const { name, periodMode, periodDuration, isActive } = data;
  return await db.periodType.create({
    data: {
      name,
      periodMode,
      periodDuration,
      isActive,
    },
  });
}

export async function getAllPeriodType() {
  return await db.periodType.findMany({
    where: {
      isDeleted: false,
    },
  });
}
export async function getPeriodTypeById(id: string) {
  return db.periodType.findFirst({
    where: {
      id: id,
    },
  });
}
export async function updatePeriodTypeById(id: string, data: PeriodTypeModel) {
  const { name, periodMode, periodDuration, isActive } = data;
  return await db.periodType.update({
    where: {
      id,
    },
    data: {
      name,
      periodMode,
      periodDuration,
      isActive,
    },
  });
}

export async function deletePeriodTypeById(id: string) {
  return await db.periodType.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });
}
