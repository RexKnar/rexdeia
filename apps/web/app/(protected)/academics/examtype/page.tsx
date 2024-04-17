import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { ExamTypeListTable } from './_components/ExamsTypesTable';
import { ExamTypePageHeader } from './_components/ExamTypePageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/examtype');
  }

  return (
    <section className="flex flex-col gap-6">
      <ExamTypePageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <ExamTypeListTable />
      </section>
    </section>
  );
}
