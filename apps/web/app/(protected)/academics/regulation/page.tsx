import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import React from 'react';

import { authOptions } from '../../../../lib/auth';
import { RegulationListTable } from './_components/RegulationListTable';
import { RegulationsOverviewContainer } from './_components/RegulationsOverviewContainer';
import { RegulationsPageHeader } from './_components/RegulationsPageHeader';
import { SaveRegulationFlyout } from './_components/SaveRegulationFlyout';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/regulation');
  }

  return (
    <section className="flex flex-col gap-6">
      <section className="space-y-2 rounded-md bg-white p-4">
        <p className="text-xl font-semibold text-gray-800">Overview</p>
        <p className="text-gray-700">
          This section provides a comprehensive overview of regulations for your
          current workspace.
        </p>
        <RegulationsOverviewContainer />
      </section>
      <RegulationsPageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <RegulationListTable />
      </section>
      <SaveRegulationFlyout />
    </section>
  );
}
