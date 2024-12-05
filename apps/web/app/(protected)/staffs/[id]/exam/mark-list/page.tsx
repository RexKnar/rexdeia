import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { PageTitle } from '@/components/PageTitle';

import MarkList from './_components/MarkList';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/class');
  }
  return (
    <section>
      <div className="mx-auto my-5">
        <Suspense>
          <PageTitle title="Mark List" className="mb-4 pl-2 " />
          <MarkList />
        </Suspense>
      </div>
    </section>
  );
}
