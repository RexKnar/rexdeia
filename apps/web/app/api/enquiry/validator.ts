import { z } from 'zod';

import { AddEnquiryModel } from './models';

const schema = z.object({});

export async function validateAddEnquiry(addEnquiry: AddEnquiryModel) {
  try {
    schema.parse(addEnquiry);
  } catch (e) {
    return Promise.reject(e);
  }
  return schema.parse(addEnquiry);
}
