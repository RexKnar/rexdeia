import { db } from '../../../lib/db';
import { FormModel } from './models';

export async function addForm(form: FormModel) {
  const createdForm = await db.form.create({
    data: {
      ...form,
    },
  });

  return createdForm;
}
