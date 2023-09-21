import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { DepartmentForm } from '../../../../lib/components/department/departmentForm';
import { searchForms } from '../../../api/forms/service';
import { getOrganisationsByUserId } from '../../../api/user/organization/service';

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
  const departmentForms = await searchForms({
    type: 'Department',
    organizationId: defaultOrganization.organizationId,
  });
  const departmentForm = departmentForms[0];

  return <DepartmentForm formConfig={departmentForm} />;
}
