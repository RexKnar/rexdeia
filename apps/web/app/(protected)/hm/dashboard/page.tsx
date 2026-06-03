import { CalendarCheck, GraduationCap, UserCog, Users } from 'lucide-react';

import { RoleDashboardPlaceholder } from '@/components/dashboard/RoleDashboardPlaceholder';

import { requireDashboardRole } from '../../../../lib/auth/resolveDashboardRole';

export default async function Page() {
  await requireDashboardRole(['hm']);

  return (
    <RoleDashboardPlaceholder
      heading="Head Master Dashboard"
      description="School-wide overview across all classes, staff and attendance."
      stats={[
        { title: 'Total Students', count: '—', icon: GraduationCap },
        { title: 'Total Staff', count: '—', icon: Users },
        { title: 'Class Teachers', count: '—', icon: UserCog },
        { title: "Today's Attendance", count: '—', icon: CalendarCheck },
      ]}
    />
  );
}
