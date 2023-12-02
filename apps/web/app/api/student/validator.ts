import { captureException } from '@sentry/nextjs';
import { z } from 'zod';

import { AddStudentModel } from '../../../lib/domain';

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string(),
});

export async function validateAddUser(student: AddStudentModel) {
  try {
    schema.parse(student);
  } catch (e) {
    captureException(e);
    return Promise.reject(e);
  }

  return schema.parse(student);
}
