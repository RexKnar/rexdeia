import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { EnquiryForm } from '../../../lib/components/enquiry/EnquiryForm';
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
  const enquiryForms = await getFormByCriteria({
    type: 'Enquiry',
    organizationId: defaultOrganization.organizationId,
  });

  const enquiryForm = enquiryForms[0];
  return <EnquiryForm formConfig={enquiryForm} />;
}
