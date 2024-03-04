import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { MediumListTable } from './_components/MediumListTable';
import { MediumPageHeader } from './_components/MediumPageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/medium');
  }

  return (
    <section className="flex flex-col gap-6">
      <MediumPageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <MediumListTable />
      </section>
    </section>
  );
}
