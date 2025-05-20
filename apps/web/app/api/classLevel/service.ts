import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { ClassLevelModel } from 'lib/domain/classLevel';
import { getServerSession } from 'next-auth';

export async function addClassLevel(data: ClassLevelModel) {
  return await db.classLevel.create({
    data: {
      name: data.name,
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
  const { branchId } = await getServerSession(authOptions);

  const classLevel = await db.classLevel.findFirst({
    where: {
      id: id,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      class: {
        where: {
          isActive: true,
          branchId: branchId,
        },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          isActive: true,
          Section: {
            select: {
              id: true,
              name: true,
              isActive: true,
            },
          },
          studentmapping: {
            select: {
              student: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  middleName: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const result = {
    ...classLevel,
    class: classLevel?.class.map((item) => ({
      ...item,
      students: item.studentmapping.map((s) => s.student),
    })),
  };

  return result;
}
