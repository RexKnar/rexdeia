import { z } from 'zod';

import { AddDepartmentModel } from './models';

const schema = z.object({});

export async function validateAddDepartment(addDepartment: AddDepartmentModel) {
  try {
    schema.parse(addDepartment);
  } catch (e) {
    return Promise.reject(e);
  }
  return schema.parse(addDepartment);
}
