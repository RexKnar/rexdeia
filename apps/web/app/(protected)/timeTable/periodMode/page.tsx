import { Suspense } from 'react';

import { PeriodModePageHeader } from './components/PeriodModeHeader';
import { PeriodModeList } from './components/PeriodModeList';

export default function Page() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <PeriodModePageHeader />
        <section className="space-y-2 rounded-md bg-white p-4">
          <PeriodModeList />
        </section>
      </Suspense>
    </section>
  );
}
