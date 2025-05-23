import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import LearnersList from './_components/LearnersList';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/course');
  }

  return (
    <section className="flex flex-col gap-6 ">
      <Suspense>
        <LearnersList />
      </Suspense>
    </section>
  );
}
