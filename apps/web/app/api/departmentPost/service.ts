import { db } from '../../../lib/db';
import { AddDepartmentModel } from './models';

export async function addDepartment(department: AddDepartmentModel) {
  return await db.departmentForm.create({
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
