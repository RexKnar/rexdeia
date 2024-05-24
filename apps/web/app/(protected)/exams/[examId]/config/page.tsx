import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { AddExamLayout } from './_components/AddExam-layout';
import { PageHeader } from './_components/PageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/batches');
  }

  return (
    <section className="flex flex-col gap-6">
      <PageHeader />
      <section className="space-y-2 rounded-md p-4">
        <AddExamLayout />
      </section>
    </section>
  );
}
