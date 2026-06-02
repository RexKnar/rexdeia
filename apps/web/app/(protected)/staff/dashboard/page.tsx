import { BookOpen, CalendarCheck, ClipboardCheck, Users } from 'lucide-react';

import { RoleDashboardPlaceholder } from '@/components/dashboard/RoleDashboardPlaceholder';
import { ScopedDashboardClient } from '@/components/dashboard/ScopedDashboardClient';
import { PageTitle } from '@/components/PageTitle';

import { requireDashboardRole } from '../../../../lib/auth/resolveDashboardRole';

export default async function Page() {
  const role = await requireDashboardRole(['staff', 'classTeacher']);

  // Class teachers get the scoped admin-style dashboard for their section(s).
  if (role === 'classTeacher') {
    return (
      <section>
        <PageTitle title="Class Teacher Dashboard" className="mb-5" />
        <ScopedDashboardClient examAnalyticsHref="/admin/exam-analytics" />
      </section>
    );
  }

  // Normal staff: a teaching-focused view (subjects + today's periods) is a
  // planned follow-up; placeholder for now.
  return (
    <RoleDashboardPlaceholder
      heading="Staff Dashboard"
      description="Your teaching schedule and assigned classes."
      stats={[
        { title: "Today's Periods", count: '—', icon: CalendarCheck },
        { title: 'Subjects', count: '—', icon: BookOpen },
        { title: 'Assigned Classes', count: '—', icon: Users },
        { title: 'Pending Marks', count: '—', icon: ClipboardCheck },
      ]}
    />
  );
}
