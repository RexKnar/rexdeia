import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../../lib/auth';
import { SubjectFormatFlyout } from './_components/_modals/SubjectFormatFlyout';
import { SubjectFormatHeader } from './_components/SubjectFormatHeader';
import { SubjectFormatListTable } from './_components/SubjectFormatListTable';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/batches');
  }

  return (
    <section className="flex flex-col gap-6">
      <SubjectFormatHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <SubjectFormatListTable />
      </section>
      <SubjectFormatFlyout />
    </section>
  );
}
