import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { authOptions } from '../../../../lib/auth';
import { RangeScaleHeader } from './_components/RangeScalesHeader';
import { RangeScaleList } from './_components/ScaleList';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/grade');
  }

  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <RangeScaleHeader />
        <section className="space-y-2 rounded-md bg-white p-4">
          <RangeScaleList />
        </section>
      </Suspense>
    </section>
  );
}
