import { StaffRoster } from 'lib/components/StaffRoster';
import { Suspense } from 'react';

import { PageTitle } from '@/components/PageTitle';

import { StaffDetail } from './components/Staffdetail';

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <section>
      <div className="mx-auto my-5">
        <Suspense>
          <PageTitle title="Staff Details" className="mb-4 pl-2 " />
          <StaffDetail />
          <div className="mt-6 px-2">
            <PageTitle title="Timetable" className="mb-4" />
            <StaffRoster staffId={params.id} />
          </div>
        </Suspense>
      </div>
    </section>
  );
}
