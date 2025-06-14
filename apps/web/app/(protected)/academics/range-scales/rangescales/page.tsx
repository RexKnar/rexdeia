import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import LoadRangeScalesList from './_components/LoadRangeScalesList';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/range-scales/rangescales');
  }

  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <section className="space-y-2 rounded-md bg-white p-4">
          <LoadRangeScalesList />
        </section>
      </Suspense>
    </section>
  );
}
