import { captureException } from '@sentry/nextjs';
import { z } from 'zod';

import { AddEnquiryModel } from './models';

const schema = z.object({});

export async function validateAddEnquiry(addEnquiry: AddEnquiryModel) {
  try {
    schema.parse(addEnquiry);
  } catch (e) {
    captureException(e);
    return Promise.reject(e);
  }
  return schema.parse(addEnquiry);
}
