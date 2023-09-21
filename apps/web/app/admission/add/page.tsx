import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { AddAdmissionContainer } from '../../../lib/components/admission/AddAdmissionContainer';
import { getFormByCriteria } from '../../api/forms/service';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin');
  }

  const [admissionForm, enquiryForm] = await Promise.all([
    getFormByCriteria({
      type: 'Admission',
      branchId: session.branchId,
      organizationId: session.organizationId,
    }),
    getFormByCriteria({
      type: 'Enquiry',
      branchId: session.branchId,
      organizationId: session.organizationId,
    }),
  ]);

  return (
    <AddAdmissionContainer
      enquiryForm={enquiryForm}
      admissionForm={admissionForm}
    />
  );
}
