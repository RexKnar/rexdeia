import { db } from '../../../lib/db';

const tablePaginationLimit = 10;

export async function getEnquiryList(pageValue) {
  return await db.enquiryForm.findMany({
    skip: pageValue,
    take: tablePaginationLimit,
  });
}
