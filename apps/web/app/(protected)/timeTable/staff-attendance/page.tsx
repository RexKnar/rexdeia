import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { PageTitle } from '@/components/PageTitle';

import { StaffAttendanceManager } from './_components/StaffAttendanceManager';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/timeTable/staff-attendance');
  }

  return (
    <section className="flex flex-col gap-4 p-2 sm:p-4">
      <Suspense>
        <section className="px-2">
          <PageTitle title="Staff Attendance & Substitution" />
          <p className="text-sm text-gray-600">
            Mark staff present, absent or on leave for a day. For absent staff,
            assign per-period substitutes — overriding the timetable for that
            date only.
          </p>
        </section>
        <StaffAttendanceManager />
      </Suspense>
    </section>
  );
}
