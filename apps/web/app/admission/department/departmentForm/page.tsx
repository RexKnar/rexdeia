import { DepartmentForm } from '../../../../lib/components/department/departmentForm';
import { authOptions } from '../../../../lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getOrganisationsByUserId } from '../../../api/user/organization/service';
import { searchForms } from '../../../api/forms/service';

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
