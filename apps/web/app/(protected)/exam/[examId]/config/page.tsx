import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { ExamConfigClient } from './_components/ExamConfigClient';
import { PageHeader } from './_components/PageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session?.branchId || !session?.organizationId) {
    return redirect('/signin?callbackUrl=/academics/batches');
  }

  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <PageHeader />
        <section className="rounded-md p-4">
          <ExamConfigClient />
        </section>
      </Suspense>
    </section>
  );
}
