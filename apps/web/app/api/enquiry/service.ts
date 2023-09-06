import { db } from '../../../lib/db';
import { AddEnquiryModel } from './models';

export async function addEnquiry(enquiry: AddEnquiryModel) {
  return await db.enquiryForm.create({
    data: {
      ...enquiry,
    },
  });
}
