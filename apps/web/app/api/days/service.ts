import { db } from 'lib/db';
import { DaysModel } from 'lib/domain/days';

export async function getAllDays() {
  const days = await db.days.findMany({
    where: {
      isDeleted: false,
    },
  });
  return days;
}

export async function getDayById(id: string) {
  const day = await db.days.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return day;
}

export async function addDay(data: DaysModel) {
  return await db.days.create({
    data: {
      name: data.name,
      isActive: data.isActive,
      periodMaster: {
        connect: {
          id: data.periodMasterId,
        },
      },
    },
  });
}

export async function updateDayById(id: string, data: DaysModel) {
  return await db.days.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      isActive: data.isActive,
      periodMaster: {
        connect: {
          id: data.periodMasterId,
        },
      },
    },
  });
}

export async function deleteDayById(id: string) {
  return await db.days.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
}
