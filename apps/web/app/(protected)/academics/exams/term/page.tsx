import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { authOptions } from 'lib/auth';
import { TermListTable } from './_components/TermListTable';
import { TermPageHeader } from './_components/TermPageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/group');
  }

  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <TermPageHeader />
      </Suspense>
      <section className="space-y-2 rounded-md bg-white p-4">
        <Suspense>
          <TermListTable />
        </Suspense>
      </section>
    </section>
  );
}
