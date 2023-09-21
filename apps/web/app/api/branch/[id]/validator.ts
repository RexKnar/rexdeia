import { z } from 'zod';

const schema = z.object({
  name: z.string(),
});

export async function validateUpdateBranchDetails(
  payload: unknown,
) {
  try {
    schema.parse(payload);
  } catch (e) {
    throw new Error('VALIDATION_ERROR');
  }
}
