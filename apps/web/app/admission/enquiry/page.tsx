import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getOrganisationsByUserId } from '../../api/user/organization/service';
import { searchForms } from '../../api/forms/service';
import { AdmissionForm } from '../../../lib/components/admission/AdmissionForm';
import { EnquiryForm } from '../../../lib/components/enquiry/EnquiryForm';

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
  const enquiryForms = await searchForms({
    type: 'Enquiry',
    organizationId: defaultOrganization.organizationId,
  });

  const enquiryForm = enquiryForms[0];
  return <EnquiryForm formConfig={enquiryForm} />;
}
