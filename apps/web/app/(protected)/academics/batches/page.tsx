import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import React from 'react';

import { authOptions } from '../../../../lib/auth';
import { BatchesListTable } from './components/BatchesListTable';
import { BatchesPageHeader } from './components/BatchesPageHeader';
import { SaveBatchFlyout } from './components/modals/SaveBatchFlyout';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/batches');
  }

  return (
    <section className="flex flex-col gap-6">
      <BatchesPageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <BatchesListTable />
        <SaveBatchFlyout />
      </section>
    </section>
  );
}
