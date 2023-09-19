import { db } from '../../../lib/db';
import { AddEnquiryModel } from './models';

export async function addEnquiry(formId: string, enquiry: AddEnquiryModel) {
  return await db.enquiryForm.create({
    data: {
      ...enquiry,
      form: {
        connect: {
          id: formId,
        },
      },
    },
  });
}
