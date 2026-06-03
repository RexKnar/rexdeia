import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { authOptions } from '../../../../lib/auth';
import { StudentAttendanceManager } from './_components/StudentAttendanceManager';
import { StudentAttendancePageHeader } from './_components/StudentAttendancePageHeader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/academics/student-attendance');
  }

  return (
    <section className="flex flex-col gap-4">
      <Suspense>
        <StudentAttendancePageHeader />
        <section className="space-y-2 rounded-md p-2 sm:p-4">
          <p className="px-2 text-sm text-gray-600">
            Mark student attendance for a section and date — for the full day, a
            whole session (morning/afternoon), or a specific period.
          </p>
          <StudentAttendanceManager />
        </section>
      </Suspense>
    </section>
  );
}
