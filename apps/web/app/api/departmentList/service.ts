import { db } from '../../../lib/db';

export async function getDeparmentList() {
  return await db.departmentForm.findRaw();
}
