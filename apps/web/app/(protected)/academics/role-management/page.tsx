import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { authOptions } from '../../../../lib/auth';
import { RoleManagementListTable } from './_components/RoleManagementListTable';
import { RoleManagementPageHeader } from './_components/RoleManagementPageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/role-management');
  }

  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <RoleManagementPageHeader />
        <section className="space-y-2 rounded-md bg-white p-4">
          <RoleManagementListTable />
        </section>
      </Suspense>
    </section>
  );
}
