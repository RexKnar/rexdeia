import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../../../../lib/auth';
import { isAuthenticated } from '../../../../lib/utils/auth';
import { AcademicYearListTable } from './_components/AcademicYearListTable';
import { AcademicYearPageHeader } from './_components/AcademicYearPageHeader';

export default async function Page() {
  if (!isAuthenticated(await getServerSession(authOptions))) {
    return redirect('/signin?callbackUrl=/academics/academic-year');
  }

  return (
    <section className="flex flex-col gap-6">
      <AcademicYearPageHeader />
      <section className="space-y-2 rounded-md bg-white p-4">
        <AcademicYearListTable />
      </section>
    </section>
  );
}
