import { db } from '../../../lib/db';
import { FormModel, SearchFormModel } from './models';

export async function addForm(form: FormModel) {
  return await db.form.create({
    data: {
      ...form,
    },
  });
}

export async function searchForms(searchFormModel: SearchFormModel) {
  const { organizationId, type } = searchFormModel;
  return await db.form.findMany({
    where: {
      type: type,
      organizationId: organizationId,
    },
  });
}
