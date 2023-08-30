import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getOrganisationsByUserId } from '../../api/user/organization/service';
import { searchForms } from '../../api/forms/service';
import { AdmissionForm } from '../../../lib/components/admission/AdmissionForm';

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
  const admissionForms = await searchForms({
    type: 'Admission',
    organizationId: defaultOrganization.organizationId,
  });
console.log(admissionForms[0].organizationId);
  const admissionForm = admissionForms[0];
  return <AdmissionForm formConfig={admissionForm} />;
}
