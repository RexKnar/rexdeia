import { AddEnquiryModel } from './models';
import { z } from 'zod';

const schema = z.object({});

export async function validateAddUser(addEnquiry: AddEnquiryModel) {
  try {
    schema.parse(addEnquiry);
  } catch (e) {
    return Promise.reject(e);
  }
  return schema.parse(addEnquiry);
}
