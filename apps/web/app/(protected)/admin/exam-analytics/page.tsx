import { PageTitle } from '@/components/PageTitle';

import { requireDashboardRole } from '../../../../lib/auth/resolveDashboardRole';
import { ExamAnalyticsClient } from './_components/ExamAnalyticsClient';

export default async function Page() {
  await requireDashboardRole(['admin', 'tech', 'ahm', 'classTeacher']);

  return (
    <section>
      <PageTitle title="Exam Analytics" className="mb-5" />
      <ExamAnalyticsClient />
    </section>
  );
}
