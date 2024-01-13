import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { CreateClassModel, UpdateClassModel } from '../../../lib/domain/class';
import { CreateSectionModel } from '../../../lib/domain/section';
import { addSection } from '../section/service';

export async function getClassList(page: number, limit: number) {
  const session = await getServerSession(authOptions);
  const [ClassList, totalClasses] = await Promise.all([
    db.class.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        branchId: session.branchId,
      },
      include: {
        Section: true,
      },
    }),
    db.class.count({
      where: {
        branchId: session.branchId,
      },
    }),
  ]);

  return {
    page,
    limit,
    data: ClassList,
    total: totalClasses,
  };
}

export async function getAllClassesByBatchId(batchId: string) {
  const session = await getServerSession(authOptions);
  return db.class.findMany({
    where: {
      branchId: session.branchId,
      batchId: batchId,
      isActive: true,
    },
  });
}

export async function addClass(classPayload: CreateClassModel) {
  const session = await getServerSession(authOptions);
  const createdClass = await db.class.create({
    data: {
      name: classPayload.name,
      isActive: classPayload.isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });

  classPayload.section.forEach((section) => {
    const createSectionModel: CreateSectionModel = {
      name: section.name,
      isActive: true,
      classId: createdClass.id,
      mediumId: section.mediumId,
    };
    addSection(createSectionModel);
  });
  return createdClass;
}

export async function deleteClassById(id: string) {
  const session = await getServerSession(authOptions);
  return db.class.update({
    where: {
      id: id,
      branchId: session.branchId,
    },
    data: {
      isActive: false,
      updatedAt: new Date(),
    },
  });
}

export async function getClassById(id: string) {
  const session = await getServerSession(authOptions);
  return db.class.findFirst({
    where: {
      id: id,
      branchId: session.branchId,
    },
  });
}

export async function updateClassById(
  id: string,
  updateClass: UpdateClassModel
) {
  const session = await getServerSession(authOptions);
  return db.class.update({
    where: {
      id: id,
      branchId: session.branchId,
    },
    data: {
      name: updateClass.name,
      isActive: updateClass.isActive,
    },
  });
}
