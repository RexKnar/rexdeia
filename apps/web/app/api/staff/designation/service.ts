import { db } from 'lib/db';
import { DesignationModel } from 'lib/domain/designation';

export async function addDesignation(payload: DesignationModel) {
  const { name, isActive } = payload;

  return db.designation.create({
    data: {
      name,
      isActive,
    },
  });
}

export async function getAllDesignation() {
  return db.designation.findMany({
    where: {
      isDeleted: false,
    },
  });
}

export async function getDesignationById(id: string) {
  return db.designation.findMany({
    where: {
      id: id,
      isDeleted: false,
    },
  });
}

export async function updateDesignationById(
  id: string,
  payload: DesignationModel
) {
  const { name, isActive } = payload;

  return db.designation.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      isActive: isActive,
    },
  });
}

export async function deleteDesignationById(id: string) {
  return db.designation.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
}
