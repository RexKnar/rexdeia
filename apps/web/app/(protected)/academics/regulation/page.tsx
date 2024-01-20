import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import React, { Suspense } from 'react';

import { authOptions } from '../../../../lib/auth';
import { RegulationListTable } from './_components/RegulationListTable';
import { RegulationsPageHeader } from './_components/RegulationsPageHeader';
import { SaveRegulationFlyout } from './_components/SaveRegulationFlyout';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/regulation');
  }

  return (
    <section className="flex flex-col gap-6">
      <RegulationsPageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <Suspense>
          <RegulationListTable />
        </Suspense>
      </section>
      <SaveRegulationFlyout />
    </section>
  );
}
