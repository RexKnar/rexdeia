import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { PageTitle } from '@/components/PageTitle';

import { TimetableStructureBuilder } from './_components/TimetableStructureBuilder';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/timeTable/structure');
  }

  return (
    <section className="flex flex-col gap-4 p-2 sm:p-4">
      <Suspense>
        <section className="px-2">
          <PageTitle title="Timetable Structure" />
          <p className="text-sm text-gray-600">
            Define the daily period &amp; interval structure for a class level —
            timings, durations and types. This is the master that the per-section
            timetable is built on.
          </p>
        </section>
        <TimetableStructureBuilder />
      </Suspense>
    </section>
  );
}
