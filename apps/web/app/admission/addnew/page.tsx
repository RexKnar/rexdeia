import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../../packages/ui/components/ui/Tabs';
import { searchForms } from '../../../app/api/forms/service';
import { getOrganisationsByUserId } from '../../../app/api/user/organization/service';
import { authOptions } from '../../../lib/auth';
import { AddNew } from '../../../lib/components/admission/AddNew';

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
  const admissionForm = admissionForms[0];
  const enquiryForms = await searchForms({
    type: 'Enquiry',
    organizationId: defaultOrganization.organizationId,
  });
  const enquiryForm = enquiryForms[0];
  return (
    <>
      <AddNew formConfig={{ admissionForm, enquiryForm }} />
    </>
  );
}
