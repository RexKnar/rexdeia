import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { db } from '../../../../lib/db';
import {
  CreateSubjectFormatModel,
  UpdateSubjectFormatModel,
} from '../../../../lib/domain/subject';

export async function deleteSubjectFormatById(id: string) {
  return await db.subjectFormat.update({
    where: {
      id: id,
    },
    data: {
      isActive: false,
      updatedAt: new Date(),
    },
  });
}

export async function getSubjectFormatById(id: string) {
  return await db.subjectFormat.findFirst({
    where: {
      id: id,
      isActive: true,
    },
  });
}

export async function updateSubjectFormatById(
  id: string,
  updateSubjectFormat: UpdateSubjectFormatModel
) {
  return await db.subjectFormat.update({
    where: {
      id: id,
    },
    data: {
      ...updateSubjectFormat,
    },
  });
}

export async function addSubjectFormat(
  createSubjectFormat: CreateSubjectFormatModel
) {
  const session = await getServerSession(authOptions);
  return await db.subjectFormat.create({
    data: {
      name: createSubjectFormat.name,
      isActive: createSubjectFormat.isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function getSubjectFormatList(page: number, limit: number) {
  const [total, subjectFormatList] = await Promise.all([
    db.subjectFormat.count(),
    db.subjectFormat.findMany({
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
    data: subjectFormatList,
  };
}
