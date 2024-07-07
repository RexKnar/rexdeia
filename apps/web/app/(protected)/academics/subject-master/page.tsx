import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { authOptions } from '../../../../lib/auth';
import { SubjectMasterListTable } from './_components/SubjectMasterListTable';
import { SubjectMasterPageHeader } from './_components/SubjectMasterPageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/subject-master');
  }

  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <SubjectMasterPageHeader />
        <section className="space-y-2 rounded-md bg-white p-4">
          <SubjectMasterListTable />
        </section>
      </Suspense>
    </section>
  );
}
