import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { CourseBills } from './_components/CourseBills';
import { PaymentHistoryHeader } from './_components/PaymentHistoryHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/course');
  }

  return (
    <section>
      <div className="mx-auto my-5 rounded-md bg-white p-6">
        <Suspense>
          <PaymentHistoryHeader />
          <CourseBills />
        </Suspense>
      </div>
    </section>
  );
}
