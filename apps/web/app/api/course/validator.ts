import { captureException } from '@sentry/nextjs';
import { z } from 'zod';

import { AddCourseModel } from './models';

const schema = z.object({});

export async function validateAddCourse(addDepartment: AddCourseModel) {
  try {
    schema.parse(addDepartment);
  } catch (e) {
    captureException(e);
    return Promise.reject(e);
  }
  return schema.parse(addDepartment);
}
