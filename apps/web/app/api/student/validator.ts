import { z } from 'zod';

import { AddStudentModel } from './models';

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string(),
});

export async function validateAddUser(addStudent: AddStudentModel) {
  try {
    schema.parse(addStudent);
  } catch (e) {
    return Promise.reject(e);
  }

  return schema.parse(addStudent);
}
