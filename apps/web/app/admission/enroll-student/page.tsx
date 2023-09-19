import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { AdmissionForm } from '../../../lib/components/admission/AdmissionForm';
import { getFormByCriteria } from '../../api/forms/service';
import { getOrganisationsByUserId } from '../../api/user/organization/service';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }

  const organizations = await getOrganisationsByUserId(session.user.id);
  if (!organizations.length) {
    return <h1>Error</h1>;
  }

  const defaultOrganization = organizations[0];
  const admissionForms = await getFormByCriteria({
    type: 'Admission',
    organizationId: defaultOrganization.organizationId,
  });
  const admissionForm = admissionForms[0];
  return <AdmissionForm formConfig={admissionForm} />;
}
