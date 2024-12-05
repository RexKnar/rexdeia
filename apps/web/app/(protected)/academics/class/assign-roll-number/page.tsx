import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';

import { PageTitle } from '@/components/PageTitle';

import AssignRollNumberForm from './_components/AssignRollNumberForm';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/class');
  }

  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <section className="flex justify-between">
          <PageTitle title="Assign Roll Number" />
        </section>

        {/* <section className="py-4 space-y-2 bg-white rounded-md"> */}
        <AssignRollNumberForm />
        {/* </section> */}
      </Suspense>
    </section>
  );
}
