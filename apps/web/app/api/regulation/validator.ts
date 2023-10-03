import { z } from 'zod';

import { AddRegulationModel } from './models';

const schema = z.object({});

export async function validateAddRegulation(addRegulation: AddRegulationModel) {
  try {
    schema.parse(addRegulation);
  } catch (e) {
    return Promise.reject(e);
  }
  return schema.parse(addRegulation);
}
