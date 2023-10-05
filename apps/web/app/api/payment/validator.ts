import { z } from 'zod';

import { AddPaymentModel } from './models';

const schema = z.object({});

export async function validateAddDepartment(AddPayment: AddPaymentModel) {
  try {
    schema.parse(AddPayment);
  } catch (e) {
    return Promise.reject(e);
  }
  return schema.parse(AddPayment);
}
