import React from 'react';

import { MediumListTable } from './_components/MediumListTable';
import { MediumPageHeader } from './_components/MediumPageHeader';
import SaveMediumFlyout from './_components/modals/SaveMediumFlyout';

export default async function Page() {
  return (
    <section className="flex flex-col gap-6">
      <MediumPageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <MediumListTable />
        <SaveMediumFlyout />
      </section>
    </section>
  );
}
