import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { authOptions } from '../../../../../lib/auth';
import { SubjectTypeFlyout } from './_components/_modals/SubjectTypeFlyout';
import { SubjectTypeHeader } from './_components/SubjectTypeHeader';
import { SubjectTypeListTable } from './_components/SubjectTypeListTable';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/subjects/subject-type');
  }
  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <SubjectTypeHeader />
        <section className="space-y-2 rounded-md bg-white p-4">
          <SubjectTypeListTable />
        </section>
        <SubjectTypeFlyout />
      </Suspense>
    </section>
  );
}
