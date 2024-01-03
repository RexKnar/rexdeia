import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import React from 'react';

import { authOptions } from '../../../../lib/auth';
import { SaveSubjectFlyout } from './components/SaveSubjectFlyout';
import { SubjectsListTable } from './components/SubjectsListTable';
import { SubjectsPageHeader } from './components/SubjectsPageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/batches');
  }

  return (
    <section className="flex flex-col gap-6">
      <SubjectsPageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <SubjectsListTable />
      </section>
      <SaveSubjectFlyout />
    </section>
  );
}
