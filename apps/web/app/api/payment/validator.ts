import { captureException } from '@sentry/nextjs';
import { z } from 'zod';

import { AddPaymentModel } from './models';

const schema = z.object({});

export async function validateAddPayment(payment: AddPaymentModel) {
  try {
    schema.parse(payment);
  } catch (e) {
    captureException(e);
    return Promise.reject(e);
  }
  return schema.parse(payment);
}
