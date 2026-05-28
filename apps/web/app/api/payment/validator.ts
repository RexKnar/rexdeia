import { captureException } from '@sentry/nextjs';
import { z } from 'zod';

export const addPaymentSchema = z.object({
  amount: z.number().positive(),
  associationType: z.string().min(1),
  associationEntityId: z.string().min(1),
});

export type AddPaymentPayload = z.infer<typeof addPaymentSchema>;

export async function validateAddPayment(
  payload: unknown
): Promise<AddPaymentPayload> {
  try {
    return addPaymentSchema.parse(payload);
  } catch (e) {
    captureException(e);
    return Promise.reject(e);
  }
}
