import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import React from 'react';

import { authOptions } from '../../../../lib/auth';
import { RegulationListTable } from './components/RegulationListTable';
import { RegulationsOverviewContainer } from './components/RegulationsOverviewContainer';
import { RegulationsPageHeader } from './components/RegulationsPageHeader';
import { SaveRegulationFlyout } from './components/SaveRegulationFlyout';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/regulation');
  }

  return (
    <section className="flex flex-col gap-6">
      <section className="space-y-2 rounded-md bg-white pb-4 pl-4 pt-4">
        <p className="text-xl font-semibold text-gray-800">Overview</p>
        <p className="text-gray-700">
          This section provides a comprehensive overview of regulations for your
          current workspace.
        </p>
        <RegulationsOverviewContainer />
      </section>
      <RegulationsPageHeader />
      <section className="space-y-2 rounded-md bg-white pb-4 pl-4 pt-4">
        <RegulationListTable />
      </section>
      <SaveRegulationFlyout />
    </section>
  );
}
