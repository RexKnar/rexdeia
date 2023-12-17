import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import React from 'react';

import { authOptions } from '../../../../lib/auth';
import { PageTitle } from '../../../../lib/components/PageTitle';
import { RegulationListTable } from './components/RegulationListTable';
import { RegulationShareFlyout } from './components/RegulationShareFlyout';
import { RegulationsOverviewContainer } from './components/RegulationsOverviewContainer';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/regulation');
  }

  return (
    <section className="flex flex-col gap-6">
      <section className="space-y-2 rounded-md bg-white p-4">
        <section>
          <p className="text-xl font-semibold text-gray-800">Overview</p>
          <p className="text-gray-700">
            This section provides a comprehensive overview of regulations for
            your current workspace.
          </p>
          <RegulationsOverviewContainer />
        </section>
      </section>
      <section className="space-y-2 rounded-md bg-white p-4">
        <section className="flex justify-between px-2">
          <PageTitle title="Regulations" />
          <RegulationShareFlyout />
        </section>

        <RegulationListTable />
      </section>
    </section>
  );
}
