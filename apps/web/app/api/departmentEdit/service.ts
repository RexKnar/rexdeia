import { db } from '../../../lib/db';
import { EditDepartmentModel } from './models';

export async function editDepartment(department: EditDepartmentModel) {
  return await db.departmentForm.update({
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
