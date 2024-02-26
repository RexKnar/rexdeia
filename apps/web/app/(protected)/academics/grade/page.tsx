import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { GradeFlyout } from './_components/_modals/SaveGradeFlyout';
import { GradeListTable } from './_components/GradeListTable';
import { GradePageHeader } from './_components/GradePageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/grade');
  }
  return (
    <section className="flex flex-col gap-6">
      <GradePageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <GradeListTable />
      </section>
      <GradeFlyout />
    </section>
  );
}
