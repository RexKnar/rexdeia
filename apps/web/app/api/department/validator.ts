import { captureException } from '@sentry/nextjs';
import { z } from 'zod';

import { AddDepartmentModel } from './models';

const schema = z.object({});

export async function validateAddDepartment(addDepartment: AddDepartmentModel) {
  try {
    schema.parse(addDepartment);
  } catch (e) {
    captureException(e);
    return Promise.reject(e);
  }
  return schema.parse(addDepartment);
}
