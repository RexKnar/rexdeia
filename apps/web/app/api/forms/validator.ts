import {
  CreateFormRequestPayload,
  CreateFormRequestPayloadSchema,
} from './models';

export async function validateAddForm(payload: CreateFormRequestPayload) {
  try {
    CreateFormRequestPayloadSchema.parse(payload);
  } catch (e) {
    throw new Error('VALIDATION_ERROR');
  }
}
