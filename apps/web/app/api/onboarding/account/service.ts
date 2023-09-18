<<<<<<< HEAD
import { admissionForm, EnquiryForm, departmentForm } from './data';
=======
>>>>>>> e57031697ec8711b0d8badbb959ce4fe36b0c361
import { db } from '../../../../lib/db';
import { admissionForm, EnquiryForm } from './data';

export async function initializeAccountForUserId(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { userOrganizations: true },
  });

  if (!user || !user.userOrganizations.length) {
    throw new Error('User not found');
  }

  const createForm = async (type: string, json: Object) => {
    return await db.form.create({
      data: {
        isActive: true,
        // @ts-ignore
        type,
        // @ts-ignore
        json: { ...json },
        organizationId: user.userOrganizations[0].organizationId,
      },
    });
  };

  await createForm('Admission', admissionForm);
  await createForm('Enquiry', EnquiryForm);
  await createForm('Department', departmentForm);
}
