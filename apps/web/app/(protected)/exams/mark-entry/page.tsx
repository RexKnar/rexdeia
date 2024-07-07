import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { MarkEntryLayout } from './_components/MarkEntryLayout';
import { MarkEntryPageHeader } from './_components/MarkEntryPageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/exams/examId');
  }

  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <MarkEntryPageHeader />
        <section className="space-y-2 rounded-md bg-white p-4">
          <MarkEntryLayout />
        </section>
      </Suspense>
    </section>
  );
}
