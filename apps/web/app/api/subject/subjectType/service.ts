import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { db } from '../../../../lib/db';
import {
  CreateSubjectTypeModel,
  UpdateSubjectTypeModel,
} from '../../../../lib/domain/subject';

export async function deleteSubjectTypeById(id: string) {
  return await db.subjectType.update({
    where: {
      id: id,
    },
    data: {
      isActive: false,
      updatedAt: new Date(),
    },
  });
}

export async function getSubjectTypeById(id: string) {
  return await db.subjectType.findFirst({
    where: {
      id: id,
      isActive: true,
    },
  });
}

export async function updateSubjectTypeById(
  id: string,
  updateSubjectType: UpdateSubjectTypeModel
) {
  return await db.subjectType.update({
    where: {
      id: id,
    },
    data: {
      ...updateSubjectType,
    },
  });
}

export async function addSubjectType(
  createSubjectType: CreateSubjectTypeModel
) {
  const session = await getServerSession(authOptions);
  return await db.subjectType.create({
    data: {
      name: createSubjectType.name,
      isActive: createSubjectType.isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function getSubjectTypeList(page: number, limit: number) {
  const [total, subjectTypeList] = await Promise.all([
    db.subjectType.count(),
    db.subjectType.findMany({
      where: {
        isActive: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    }),
  ]);

  return {
    total,
    page,
    limit,
    data: subjectTypeList,
  };
}
