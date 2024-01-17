import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { CreateGroupModel, UpdateGroupModel } from '../../../lib/domain/group';

export async function getAllGroups(
  page: number,
  limit: number,
  status: string
) {
  const session = await getServerSession(authOptions);

  const [total, groupList] = await Promise.all([
    db.group.count({
      where: {
        isActive: Boolean(status),
        branchId: session.branchId,
      },
    }),
    db.group.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        branchId: session.branchId,
        isActive: Boolean(status),
        isDeleted: false,
      },
    }),
  ]);

  return {
    page,
    total,
    limit,
    data: groupList,
  };
}

export async function addGroup(createGroupPayload: CreateGroupModel) {
  const session = await getServerSession(authOptions);
  return db.group.create({
    data: {
      name: createGroupPayload.name,
      isActive: createGroupPayload.isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function updateGroupById(
  id: string,
  updateGroupPayload: UpdateGroupModel
) {
  const session = await getServerSession(authOptions);
  return db.group.update({
    where: {
      id: id,
    },
    data: {
      name: updateGroupPayload.name,
      isActive: updateGroupPayload.isActive,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function getGroupById(id: string) {
  const session = await getServerSession(authOptions);
  return db.group.findFirst({
    where: {
      id: id,
      isDeleted: false,
      branchId: session.branchId,
    },
  });
}

export async function deleteGroupById(id: string) {
  const session = await getServerSession(authOptions);
  return db.group.update({
    where: {
      id: id,
      branchId: session.branchId,
    },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
}
