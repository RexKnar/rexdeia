import { captureException } from '@sentry/nextjs';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  institute: z.string(),
  description: z.string().optional(),
});

export async function validateUpdateOrganizationDetails(payload: unknown) {
  try {
    schema.parse(payload);
  } catch (e) {
    captureException(e);
    throw new Error('VALIDATION_ERROR');
  }
}
