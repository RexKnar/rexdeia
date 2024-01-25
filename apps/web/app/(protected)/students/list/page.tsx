import { Suspense } from 'react';

import { StudentPageHeader } from './_components/StudentPageHeader';
import { StudentsList } from './_components/StudentsList';

export default async function Page() {
  return (
    <section>
      <div className="mx-auto my-5 rounded-md bg-white p-6">
        <StudentPageHeader />
        <Suspense>
          <StudentsList />
        </Suspense>
      </div>
    </section>
  );
}
