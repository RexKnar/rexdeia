import { Suspense } from 'react';

import { PeriodTypePageHeader } from './components/PeriodTypeHeader';
import { PeriodTypeList } from './components/periodTypeList';

export default function Page() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <PeriodTypePageHeader />
        <section className="space-y-2 rounded-md bg-white p-4">
          <PeriodTypeList />
        </section>
      </Suspense>
    </section>
  );
}
