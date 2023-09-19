import { db } from '../../../lib/db';

export async function getRegulationList() {
  return await db.regulationForm.findMany({
    where: { isDeleted: false }
  });
}
