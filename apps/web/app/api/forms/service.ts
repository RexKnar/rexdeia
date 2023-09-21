import { db } from '../../../lib/db';
import { FormCriteriaModel } from './models';

export async function getFormByCriteria(criteria: FormCriteriaModel) {
  const { branchId, organizationId, type } = criteria;

  return await db.form.findFirst({
    where: {
      type: type,
      branchId: branchId,
      organizationId: organizationId,
    },
  });
}
