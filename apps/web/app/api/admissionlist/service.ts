import { db } from '../../../lib/db';

export async function getAdmissionList() {
  return await db.admissionForm.findRaw();
}