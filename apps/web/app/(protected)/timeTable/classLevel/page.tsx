import { Suspense } from 'react';

import { ClassLevelPageHeader } from './components/ClassLevelHeader';
import { ClassLevelList } from './components/ClassLevelList';

export default function Page() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <ClassLevelPageHeader />
        <section className="space-y-2 rounded-md bg-white p-4">
          <ClassLevelList />
        </section>
      </Suspense>
    </section>
  );
}
