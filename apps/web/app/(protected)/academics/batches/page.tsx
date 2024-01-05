import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import React from 'react';

import { authOptions } from '../../../../lib/auth';
import { BatchesListTable } from './_components/BatchesListTable';
import { BatchesPageHeader } from './_components/BatchesPageHeader';
import { SaveBatchFlyout } from './_components/modals/SaveBatchFlyout';

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
