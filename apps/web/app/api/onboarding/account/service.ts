import { admissionForm, EnquiryForm } from './data';
import { db } from '../../../../lib/db';

export async function initializeAccountForUserId(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { userOrganizations: true },
  });

  if (!user || !user.userOrganizations.length) {
    throw new Error('User not found');
  }

  await db.form.create({
    data: {
      isActive: true,
      type: 'Admission',
      json: { ...admissionForm },
      organizationId: user.userOrganizations[0].organizationId,
    },
  });

  await db.form.create({
    data: {
      isActive: true,
      type: 'Enquiry',
      json: { ...EnquiryForm },
      organizationId: user.userOrganizations[0].organizationId,
    },
  });
}
