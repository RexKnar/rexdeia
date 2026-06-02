import { PageTitle } from '@/components/PageTitle';

import { requireDashboardRole } from '../../../../lib/auth/resolveDashboardRole';
import { AdminDashboardClient } from './_components/AdminDashboardClient';

export default async function Page() {
  await requireDashboardRole(['admin', 'tech']);

  return (
    <section>
      <PageTitle title="Admin Dashboard" className="mb-5" />
      <AdminDashboardClient />
    </section>
  );
}
