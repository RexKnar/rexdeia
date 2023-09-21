import { db } from '../../../../lib/db';
import { admissionForm, departmentForm, EnquiryForm } from './data';

export async function onboardEntities(
  branchId: string,
  organizationId: string,
) {
  const createForm = async (type: string, json: Object) => {
    await db.form.deleteMany({
      where: { type: type, branchId: branchId, organizationId: organizationId },
    });

    return await db.form.create({
      data: {
        type,
        isActive: true,
        json: json as any,
        branch: { connect: { id: branchId } },
        organization: { connect: { id: organizationId } },
      },
    });
  };

  await createForm('Enquiry', EnquiryForm);
  await createForm('Department', departmentForm);
  await createForm('Admission', admissionForm);
}
