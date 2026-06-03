import { ScopedDashboardClient } from '@/components/dashboard/ScopedDashboardClient';
import { PageTitle } from '@/components/PageTitle';

import { requireDashboardRole } from '../../../../lib/auth/resolveDashboardRole';

export default async function Page() {
  await requireDashboardRole(['admin', 'tech']);

  return (
    <section>
      <PageTitle title="Admin Dashboard" className="mb-5" />
      <ScopedDashboardClient examAnalyticsHref="/admin/exam-analytics" />
    </section>
  );
}
