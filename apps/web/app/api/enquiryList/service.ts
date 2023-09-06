import { db } from '../../../lib/db';

const tablePaginationLimit = 10

export async function getEnquiryList(pageValue) {

  // const totalStudents = await db.enquiryForm.count();

  return await db.enquiryForm.findMany({
    skip: pageValue,
    take: tablePaginationLimit,
  })
}