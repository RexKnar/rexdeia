import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { NatureOfPostingModel } from 'lib/domain/natureOfPosting';
import { getServerSession } from 'next-auth';

export async function addNatureOfPosting(payload: NatureOfPostingModel) {
  const session = await getServerSession(authOptions);
  const { name, isActive } = payload;

  return db.natureOfPosting.create({
    data: {
      name,
      isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function getAllNatureOfPosting() {
  const { branchId } = await getServerSession(authOptions);
  return db.natureOfPosting.findMany({
    where: {
      isDeleted: false,
      branchId,
    },
  });
}

export async function getNatureOfPostingById(id: string) {
  const session = await getServerSession(authOptions);
  return db.natureOfPosting.findMany({
    where: {
      id: id,
      isDeleted: false,
      branchId: session.branchId,
    },
  });
}

export async function updateNatureOfPostingById(
  id: string,
  payload: NatureOfPostingModel
) {
  const { name, isActive } = payload;
  const session = await getServerSession(authOptions);

  return db.natureOfPosting.update({
    where: {
      id: id,
    },
    data: {
      name,
      isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function deleteNatureOfPostingById(id: string) {
  return db.natureOfPosting.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
}
