import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { StudentAnalyticsHeader } from '../_components/StudentAnalyticsPageheader';
import { AnalyticStudentList } from './_components/AnalyticStudentList';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/analytics/students-list');
  }

  return (
    <section className="space-y-2 rounded-md p-4">
      <Suspense>
        <StudentAnalyticsHeader />
        <AnalyticStudentList />
      </Suspense>
    </section>
  );
}
