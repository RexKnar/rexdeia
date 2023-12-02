import { captureException } from '@sentry/nextjs';

import {
  CreateFormRequestPayload,
  CreateFormRequestPayloadSchema,
} from './models';

export async function validateAddForm(payload: CreateFormRequestPayload) {
  try {
    CreateFormRequestPayloadSchema.parse(payload);
  } catch (e) {
    captureException(e);
    throw new Error('VALIDATION_ERROR');
  }
}
