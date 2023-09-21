import { z } from 'zod';

import { EditDepartmentModel } from './models';

const schema = z.object({});

export async function validateAddUser(addDepartment: EditDepartmentModel) {
  try {
    schema.parse(addDepartment);
  } catch (e) {
    return Promise.reject(e);
  }
  return schema.parse(addDepartment);
}
