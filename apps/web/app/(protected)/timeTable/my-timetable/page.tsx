import { authOptions } from 'lib/auth';
import { StaffRoster } from 'lib/components/StaffRoster';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { PageTitle } from '@/components/PageTitle';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/timeTable/my-timetable');
  }

  return (
    <section className="flex flex-col gap-4 p-2 sm:p-4">
      <Suspense>
        <section className="px-2">
          <PageTitle title="My Timetable" />
          <p className="text-sm text-gray-600">
            Your weekly schedule and today&apos;s periods, including any
            substitutions for today.
          </p>
        </section>
        <StaffRoster />
      </Suspense>
    </section>
  );
}
