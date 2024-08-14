import { Suspense } from 'react';

import PeriodMasterPageHeader from './components/PeriodMasterHeader';
import PeriodMasterList from './components/PeriodMasterList';

export default function Page() {
  return (
    <section>
      <PeriodMasterPageHeader />
      <Suspense>
        <PeriodMasterList />
      </Suspense>
    </section>
  );
}
