import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';

import { StaffClassList } from './_components/StaffClassList';
import { StaffClassPageHeader } from './_components/StaffClassPageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/class');
  }

  return (
    <section className="flex flex-col gap-6">
      <Suspense>
        <StaffClassPageHeader />
        <section className="space-y-2 rounded-md bg-white py-4">
          <StaffClassList />
        </section>
      </Suspense>
    </section>
  );
}
