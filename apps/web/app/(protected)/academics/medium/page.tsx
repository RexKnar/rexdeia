import { Suspense } from 'react';

import SaveMediumFlyout from './_components/_modals/SaveMediumFlyout';
import { MediumListTable } from './_components/MediumListTable';
import { MediumPageHeader } from './_components/MediumPageHeader';

export default async function Page() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <MediumPageHeader />
      </Suspense>
      <section className="space-y-2 rounded-md bg-white p-4">
        <Suspense>
          <MediumListTable />
        </Suspense>
        <SaveMediumFlyout />
      </section>
    </section>
  );
}
