import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import {
  CreateSubjectTypeModel,
  UpdateSubjectTypeModel,
} from 'lib/domain/subject';
import { getServerSession } from 'next-auth';

export async function getSubjectTypeList(page: number, limit: number) {
  const session = await getServerSession(authOptions);
  const [subjectType, totalSubjectType] = await Promise.all([
    db.subjectType.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        isDeleted: false,
        branchId: session.branchId,
      },
      include: {
        parentSubjectType: true,
        childSubjectTypes: true,
      },
    }),
    db.subjectType.count({
      where: {
        isDeleted: false,
        branchId: session.branchId,
      },
    }),
  ]);

  return {
    page,
    limit,
    data: subjectType,
    total: totalSubjectType,
  };
}

export async function getSubjectTypeById(id: string) {
  return db.subjectType.findUnique({
    where: {
      id: id,
      isActive: true,
    },
    include: {
      childSubjectTypes: true,
    },
  });
}

export async function addSubjectType(
  parentId: string | null | undefined,
  subjectType: CreateSubjectTypeModel
) {
  const session = await getServerSession(authOptions);
  const data = {
    name: subjectType.name,
    isActive: subjectType.isActive,
    hasMarkEntry: subjectType.hasMarkEntry,
    branch: {
      connect: {
        id: session.branchId,
      },
    },
  };

  if (parentId !== null && parentId !== undefined) {
    data['parentSubjectType'] = {
      connect: {
        id: parentId,
      },
    };
  }

  return db.subjectType.create({
    data,
  });
}

export async function updateSubjectTypeById(
  subjectId: string,
  subjectType: UpdateSubjectTypeModel
) {
  const session = await getServerSession(authOptions);

  return db.subjectType.update({
    data: {
      name: subjectType.name,
      isActive: subjectType.isActive,
      parentSubjectType: {
        connect: {
          id: subjectType.parentId,
        },
      },
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
    where: {
      id: subjectId,
    },
  });
}

export async function deleteSubjectType(subjectTypeId: string) {
  return db.subjectType.update({
    where: {
      id: subjectTypeId,
    },
    data: {
      isDeleted: true,
    },
  });
}
