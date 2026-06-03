import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { PageTitle } from '@/components/PageTitle';

import { HolidaysManager } from './_components/HolidaysManager';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/timeTable/holidays');
  }

  return (
    <section className="flex flex-col gap-4 p-2 sm:p-4">
      <Suspense>
        <section className="px-2">
          <PageTitle title="Holidays" />
          <p className="text-sm text-gray-600">
            Add school holidays for the current academic year. They appear to
            staff and students and are excluded from period-count calculations.
          </p>
        </section>
        <HolidaysManager />
      </Suspense>
    </section>
  );
}
