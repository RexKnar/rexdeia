import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { MarkEntryLayout } from './_components/MarkEntryLayout';
import { MarkEntryPageHeader } from './_components/MarkEntryPageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/exams/examId');
  }

  return (
    <section className="flex flex-col gap-6">
      <MarkEntryPageHeader />
      <section className="p-4 space-y-2 bg-white rounded-md">
        <MarkEntryLayout />
      </section>
    </section>
  );
}
