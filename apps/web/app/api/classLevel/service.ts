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
  const session = await getServerSession(authOptions);
  return await db.classLevel.findMany({
    where: {
      isDeleted: false,
      ClassLevelIncharge: {
        some: {
          organizationId: session.organizationId,
          branchId: session.branchId,
        },
      },
    },
    include: {
      ClassLevelIncharge: {
        select: {
          staff: {
            select: {
              firstName: true,
              id: true,
            },
          },
        },
      },
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
    },
  });

  return classLevel;
}
