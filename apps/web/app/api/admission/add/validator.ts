import { AddAdmissionModel } from './models';
import { db } from '../../../../lib/db';
import { z } from 'zod';

const schema = z.object({
 firstName: z.string(),
  lastName: z.string(),
  middleName: z.string()
});

export async function validateAddUser(addAdmission: AddAdmissionModel) {
  try {
    schema.parse(addAdmission);
  } catch (e) {
    return Promise.reject(e);
  }

  return schema.parse(addAdmission);
}
