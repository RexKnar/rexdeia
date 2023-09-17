import { z } from 'zod';

import { CreateOrganizationRequestPayload } from './models';

const schema = z.object({
  name: z.string(),
  institute: z.string(),
});

export async function validateAddOrganization(
  payload: CreateOrganizationRequestPayload,
) {
  try {
    schema.parse(payload);
  } catch (e) {
    throw new Error('VALIDATION_ERROR');
  }
}
