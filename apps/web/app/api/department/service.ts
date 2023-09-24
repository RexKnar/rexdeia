import { db } from '../../../lib/db';
import { AddDepartmentModel, EditDepartmentModel } from './models';

export async function addDepartment(department: AddDepartmentModel) {
  return await db.department.create({
    data: {
      ...department,
      departmentName: department.departmentName,
      noOfYears: department.noOfYears,
      departmentCode: department.departmentCode,
      activeStatus: department.activeStatus,
      description: department.description,
    },
  });
}

export async function deleteDeparment(departmentId) {
  return await db.department.update({
    where: {
      id: departmentId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
}

export async function editDepartment(department: EditDepartmentModel) {
  return await db.department.update({
    where: {
      id: department.id,
    },
    data: {
      departmentName: department.departmentName,
      noOfYears: department.noOfYears,
      departmentCode: department.departmentCode,
      activeStatus: department.activeStatus,
      description: department.description,
    },
  });
}
