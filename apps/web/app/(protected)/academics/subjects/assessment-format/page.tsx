import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { authOptions } from '../../../../../lib/auth';
import { AssessmentFormatHeader } from './_components/AssessmentFormatHeader';
import { AssessmentFormatListTable } from './_components/AssessmentFormatListTable';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect(
      '/signin?callbackUrl=/academics/subjects/assessment-format'
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <AssessmentFormatHeader />
        <section className="space-y-2 rounded-md bg-white p-4">
          <AssessmentFormatListTable />
        </section>
      </Suspense>
    </section>
  );
}
