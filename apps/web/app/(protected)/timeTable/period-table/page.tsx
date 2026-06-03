import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { PageTitle } from '@/components/PageTitle';

import { PeriodTableBuilder } from './_components/PeriodTableBuilder';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/timeTable/period-table');
  }

  return (
    <section className="flex flex-col gap-4 p-2 sm:p-4">
      <Suspense>
        <section className="px-2">
          <PageTitle title="Period Table" />
          <p className="text-sm text-gray-600">
            Assign a subject and staff to each period, per weekday, for a section
            in the current academic year.
          </p>
        </section>
        <PeriodTableBuilder />
      </Suspense>
    </section>
  );
}
