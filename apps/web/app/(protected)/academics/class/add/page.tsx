import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { authOptions } from '../../../../../lib/auth';
import AddClass from './_components/AddClass';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || !session.branchId || !session.organizationId) {
    return redirect('/signIn?callbackUrl=/academics/class/add');
  }

  return (
    <section className="mx-auto my-5 rounded-md bg-white p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <AddClass />
      </Suspense>
    </section>
  );
}
