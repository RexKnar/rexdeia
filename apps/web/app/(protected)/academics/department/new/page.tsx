import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../lib/auth';
import { DepartmentForm } from '../../../../../lib/components/department/departmentForm';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/department/new');
  }
  console.log(`-->${session.branchId}------>${session.organizationId}`);
  return (
    <DepartmentForm
      branchId={session.branchId}
      organizationId={session.organizationId}
    />
  );
}
