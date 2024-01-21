import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { authOptions } from '../../../../lib/auth';
import SaveGroupFlyout from './_components/_modals/SaveGroupFlyout';
import { GroupListTable } from './_components/GroupListTable';
import { GroupPageHeader } from './_components/GroupPageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/group');
  }

  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <GroupPageHeader />
      </Suspense>
      <section className="space-y-2 rounded-md bg-white p-4">
        <Suspense>
          <GroupListTable />
        </Suspense>
        <SaveGroupFlyout />
      </section>
    </section>
  );
}
