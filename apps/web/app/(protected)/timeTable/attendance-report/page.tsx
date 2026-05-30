import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { PageTitle } from '@/components/PageTitle';

import { AttendanceReport } from './_components/AttendanceReport';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/timeTable/attendance-report');
  }

  return (
    <section className="flex flex-col gap-4 p-2 sm:p-4">
      <Suspense>
        <section className="px-2">
          <PageTitle title="Attendance Report" />
          <p className="text-sm text-gray-600">
            Per-student attendance summary for a section over a date range, with
            Excel and PDF export.
          </p>
        </section>
        <AttendanceReport />
      </Suspense>
    </section>
  );
}
