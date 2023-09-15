import { AddDepartmentModel } from './models';
import { z } from 'zod';

const schema = z.object({});

export async function validateAddUser(addDepartment: AddDepartmentModel) {
  try {
    schema.parse(addDepartment);
  } catch (e) {
    return Promise.reject(e);
  }
  return schema.parse(addDepartment);
}
