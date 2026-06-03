import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import { AnalyticsDashboard } from './_components/AnalyticsDashboard';
import { StudentAnalyticsHeader } from './_components/StudentAnalyticsPageheader';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session.branchId || !session.organizationId) {
    return redirect('/signin?callbackUrl=/analytics/students-list');
  }

  return (
    <section className="space-y-4 rounded-md p-4">
      <Suspense>
        <StudentAnalyticsHeader />
        <AnalyticsDashboard />
      </Suspense>
    </section>
  );
}
