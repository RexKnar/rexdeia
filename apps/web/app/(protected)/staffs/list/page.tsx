import { Suspense } from 'react';

import { StaffList } from './components/StaffList';
import { StaffPageHeader } from './components/StaffPageHeader';

export default async function Page() {
  return (
    <section>
      <div className="mx-auto my-5 rounded-md bg-white p-6">
        <StaffPageHeader />
        <Suspense>
          <StaffList />
        </Suspense>
      </div>
    </section>
  );
}
