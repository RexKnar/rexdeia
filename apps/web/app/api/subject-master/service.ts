import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import {
  CreateSubjectMasterModel,
  UpdateSubjectMasterModel,
} from 'lib/domain/subject';
import { getServerSession } from 'next-auth';

type SubjectMasterFilter = {
  isActive?: string;
};

export async function addSubjectMaster(
  createSubjectMasterPayload: CreateSubjectMasterModel
) {
  const session = await getServerSession(authOptions);
  return db.subjectMaster.create({
    data: {
      name: createSubjectMasterPayload.name,
      isActive: createSubjectMasterPayload.isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function getAllSubjectMastersWithFilter(
  page: number,
  limit: number,
  filter: SubjectMasterFilter
) {
  const { isActive } = filter;
  const { branchId } = await getServerSession(authOptions);

  const whereClause = {
    branchId,
    isDeleted: false,
  };

  if (isActive !== undefined) {
    whereClause['isActive'] = isActive;
  }

  const [total, subjectMastersList] = await Promise.all([
    db.subjectMaster.count({
      where: whereClause,
    }),
    db.subjectMaster.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: whereClause,
    }),
  ]);

  return {
    page,
    total,
    limit,
    data: subjectMastersList,
  };
}

export async function updateSubjectMasterById(
  id: string,
  updateSubject: UpdateSubjectMasterModel
) {
  return db.subjectMaster.update({
    where: {
      id: id,
    },
    data: {
      name: updateSubject.name,
      isActive: updateSubject.isActive,
    },
  });
}

export async function getSubjectMasterById(id: string) {
  const session = await getServerSession(authOptions);
  return db.subjectMaster.findFirst({
    where: {
      id: id,
      branchId: session.branchId,
      isDeleted: false,
    },
  });
}

export async function deleteSubjectMasterById(id: string) {
  return db.subjectMaster.update({
    where: {
      id: id,
      AND: [
        {
          subject: {
            none: {},
          },
        },
      ],
    },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
}
