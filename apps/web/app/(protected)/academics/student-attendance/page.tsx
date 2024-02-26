import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { StudentAttendanceListTable } from './_components/StudentAttendanceListTable';
import { StudentAttendancePageHeader } from './_components/StudentAttendancePageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/batches');
  }

  return (
    <section className="flex flex-col gap-6">
      <StudentAttendancePageHeader />
      <section className="space-y-2 rounded-md  p-4">
        <StudentAttendanceListTable />
      </section>
    </section>
  );
}
