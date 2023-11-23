import { z } from 'zod';

import { RegulationModel } from '../../../lib/domain/regulation';

const schema = z.object({});

export async function validateAddRegulation(addRegulation: RegulationModel) {
  try {
    schema.parse(addRegulation);
  } catch (e) {
    return Promise.reject(e);
  }
  return schema.parse(addRegulation);
}
