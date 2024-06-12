import { db } from 'lib/db';
import { StaffCategoryModel } from 'lib/domain/staffCategory';

export async function addStaffCategory(payload: StaffCategoryModel) {
  const { name, isActive } = payload;

  return db.staffCategory.create({
    data: {
      name,
      isActive,
    },
  });
}

export async function getAllStaffCategory() {
  return db.staffCategory.findMany({
    where: {
      isDeleted: false,
    },
  });
}

export async function getStaffCategoryById(id: string) {
  return db.staffCategory.findMany({
    where: {
      id: id,
      isDeleted: false,
    },
  });
}

export async function updateStaffCategoryById(
  id: string,
  payload: StaffCategoryModel
) {
  const { name, isActive } = payload;

  return db.staffCategory.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      isActive: isActive,
    },
  });
}

export async function deleteStaffCategoryById(id: string) {
  return db.staffCategory.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
}
