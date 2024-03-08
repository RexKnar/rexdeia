import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { db } from '../../../../lib/db';
import {
  CreateSubjectTypeModel,
  UpdateSubjectTypeModel,
} from '../../../../lib/domain/subject';

export async function deleteSubjectTypeById(id: string) {
  return db.subjectType.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
}

export async function getSubjectTypeById(id: string) {
  return db.subjectType.findFirst({
    where: {
      id: id,
      isDeleted: false,
    },
  });
}

export async function updateSubjectTypeById(
  id: string,
  updateSubjectType: UpdateSubjectTypeModel
) {
  return db.subjectType.update({
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

  return db.subjectType.create({
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
  const session = await getServerSession(authOptions);

  const [total, subjectTypeList] = await db.$transaction([
    db.subjectType.count({
      where: {
        isDeleted: false,
        branchId: session.branchId,
      },
    }),
    db.subjectType.findMany({
      where: {
        isDeleted: false,
        branchId: session.branchId,
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
