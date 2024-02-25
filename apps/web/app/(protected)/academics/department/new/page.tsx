import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { DepartmentForm } from '@/components/department/departmentForm';

import { authOptions } from '../../../../../lib/auth';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/department/new');
  }
  return (
    <DepartmentForm
      branchId={session.branchId}
      organizationId={session.organizationId}
    />
  );
}
