import { db } from '../../../lib/db';
import { SearchFormModel } from './models';

export async function searchForms(searchFormModel: SearchFormModel) {
  const { organizationId, type } = searchFormModel;
  return await db.form.findMany({
    where: {
      type: type,
      organizationId: organizationId,
    },
  });
}
