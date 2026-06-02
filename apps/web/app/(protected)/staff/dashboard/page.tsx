import { BookOpen, CalendarCheck, ClipboardCheck, Users } from 'lucide-react';

import { RoleDashboardPlaceholder } from '@/components/dashboard/RoleDashboardPlaceholder';

import { requireDashboardRole } from '../../../../lib/auth/resolveDashboardRole';

export default async function Page() {
  const role = await requireDashboardRole(['staff', 'classTeacher']);
  const isClassTeacher = role === 'classTeacher';

  return (
    <RoleDashboardPlaceholder
      heading={isClassTeacher ? 'Class Teacher Dashboard' : 'Staff Dashboard'}
      description={
        isClassTeacher
          ? 'Overview of your class along with your teaching schedule.'
          : 'Your teaching schedule and assigned classes.'
      }
      stats={
        isClassTeacher
          ? [
              { title: 'My Class Students', count: '—', icon: Users },
              { title: "Today's Periods", count: '—', icon: CalendarCheck },
              { title: 'Class Attendance', count: '—', icon: ClipboardCheck },
              { title: 'Subjects', count: '—', icon: BookOpen },
            ]
          : [
              { title: "Today's Periods", count: '—', icon: CalendarCheck },
              { title: 'Subjects', count: '—', icon: BookOpen },
              { title: 'Assigned Classes', count: '—', icon: Users },
              { title: 'Pending Marks', count: '—', icon: ClipboardCheck },
            ]
      }
    />
  );
}
