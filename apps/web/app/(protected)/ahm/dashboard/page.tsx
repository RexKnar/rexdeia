import { CalendarCheck, ClipboardList, Layers, Users } from 'lucide-react';

import { RoleDashboardPlaceholder } from '@/components/dashboard/RoleDashboardPlaceholder';

import { requireDashboardRole } from '../../../../lib/auth/resolveDashboardRole';

export default async function Page() {
  await requireDashboardRole(['ahm']);

  return (
    <RoleDashboardPlaceholder
      heading="Assistant Head Master Dashboard"
      description="Overview of the class levels you are in charge of."
      stats={[
        { title: 'My Class Levels', count: '—', icon: Layers },
        { title: 'Students', count: '—', icon: Users },
        { title: 'Pending Approvals', count: '—', icon: ClipboardList },
        { title: "Today's Attendance", count: '—', icon: CalendarCheck },
      ]}
    />
  );
}
