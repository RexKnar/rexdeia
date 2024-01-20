import { Suspense } from 'react';

import SaveGroupFlyout from './_components/_modals/SaveGroupFlyout';
import { GroupListTable } from './_components/GroupListTable';
import { GroupPageHeader } from './_components/GroupPageHeader';

export default async function Page() {
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
