import { db } from 'lib/db';
import { PeriodModel } from 'lib/domain/period';

export async function addPeriod(data: PeriodModel) {
  return await db.periods.create({
    data: {
      name: data.name,
      isActive: data.isActive,
      subject: {
        connect: {
          id: data.subjectId,
        },
      },
    },
  });
}

export async function getAllPeriod() {
  return await db.periods.findMany({
    where: {
      isDeleted: false,
    },
  });
}
export async function getPeriodById(id: string) {
  return db.periods.findFirst({
    where: {
      id: id,
    },
  });
}
export async function updatePeriodById(id: string, data: PeriodModel) {
  return await db.periods.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      isActive: data.isActive,
      subject: {
        connect: {
          id: data.subjectId,
        },
      },
    },
  });
}

export async function deletePeriodById(id: string) {
  return await db.periods.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });
}
