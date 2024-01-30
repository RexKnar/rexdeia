import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { AcademicYearListTable } from './_components/AcademicYearListTable';
import { AcademicYearPageHeader } from './_components/AcademicYearPageHeader';
import { SaveAcademicYearFlyout } from './_components/modals/SaveAcademicYearFlyout';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/batches');
  }

  return (
    <section className="flex flex-col gap-6">
      <AcademicYearPageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <AcademicYearListTable />
        <SaveAcademicYearFlyout />
      </section>
    </section>
  );
}
