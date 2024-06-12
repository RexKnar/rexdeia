import { db } from 'lib/db';
import { EmploymentTypeModel } from 'lib/domain/employmentType';

export async function addEmploymentType(payload: EmploymentTypeModel) {
  const { name, isActive } = payload;

  return db.employmentType.create({
    data: {
      name,
      isActive,
    },
  });
}

export async function getAllEmploymentType() {
  return db.employmentType.findMany({
    where: {
      isDeleted: false,
    },
  });
}

export async function getEmploymentTypeById(id: string) {
  return db.employmentType.findMany({
    where: {
      id: id,
      isDeleted: false,
    },
  });
}

export async function updateEmploymentTypeById(
  id: string,
  payload: EmploymentTypeModel
) {
  const { name, isActive } = payload;

  return db.employmentType.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      isActive: isActive,
    },
  });
}

export async function deleteEmploymentTypeById(id: string) {
  return db.employmentType.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
}
