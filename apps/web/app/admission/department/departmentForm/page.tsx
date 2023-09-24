import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { DepartmentForm } from '../../../../lib/components/department/departmentForm';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    redirect('/signin');
  }
  return <DepartmentForm />;
}
