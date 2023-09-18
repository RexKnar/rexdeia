import { db } from '../../../../lib/db';
import { admissionForm, EnquiryForm } from './data';

export async function onboardEntities(branchId: string, organizationId: string) {

  const createForm = async (type: string, json: Object) => {
    await db.form.deleteMany({ where: { type: type, branchId: branchId, organizationId: organizationId } });

    return await db.form.create({
      data: {
        type,
        isActive: true,
        json: JSON.stringify(json),
        branch: { connect: { id: branchId } },
        organization: { connect: { id: organizationId } },
      },
    });
  };

  await createForm('Enquiry', EnquiryForm);
  await createForm('Admission', admissionForm);
}
