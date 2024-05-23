import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { ExamsList } from './_components/ExamsList';
import { ExamsPageHeader } from './_components/ExamsPageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/batches');
  }

  return (
    <section className="flex flex-col gap-6">
      <ExamsPageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <ExamsList />
      </section>
    </section>
  );
}
