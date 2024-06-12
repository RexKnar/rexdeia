import { CommunityModel } from 'lib/domain/community';

import { db } from '../../../lib/db';

export async function addCommunity(payload: CommunityModel) {
  const { name, isActive } = payload;

  return db.community.create({
    data: {
      name,
      isActive,
    },
  });
}

export async function getAllCommunity() {
  return db.community.findMany({
    where: {
      isDeleted: false,
    },
  });
}

export async function getCommunityById(id: string) {
  return db.community.findMany({
    where: {
      id: id,
      isDeleted: false,
    },
  });
}

export async function updateCommunityById(id: string, payload: CommunityModel) {
  const { name, isActive } = payload;

  return db.community.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      isActive: isActive,
    },
  });
}

export async function deleteCommunityById(id: string) {
  return db.community.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
}
