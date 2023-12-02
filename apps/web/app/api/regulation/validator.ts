import { captureException } from '@sentry/nextjs';
import { z } from 'zod';

import { RegulationModel } from '../../../lib/domain/regulation';

const schema = z.object({});

export async function validateAddRegulation(addRegulation: RegulationModel) {
  try {
    schema.parse(addRegulation);
  } catch (e) {
    captureException(e);
    return Promise.reject(e);
  }
  return schema.parse(addRegulation);
}
