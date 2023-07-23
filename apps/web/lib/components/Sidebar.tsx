'use client';

import { Button } from 'ui';
import { useCallback } from 'react';
import { GraduationCap, LayoutDashboard, ListMinus } from 'lucide-react';
import { useRouter } from 'next/navigation';

type MenuItem =
  | 'admission-dashboard'
  | 'admission-activities'
  | 'admission-enroll-student';

const menuItemPaths: Record<MenuItem, string> = {
  'admission-dashboard': '/admission/dashboard',
  'admission-activities': '/admission/activities',
  'admission-enroll-student': '/admission/enroll-student',
};

export function Sidebar() {
  const router = useRouter();

  const handleMenuClick = useCallback(
    (item: MenuItem) => {
      const path = menuItemPaths[item];
      if (path) {
        router.push(path);
      }
    },
    [router],
  );

  return (
    <div className="w-64 pb-12">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admission
          </h2>
          <div className="space-y-1">
            <Button
              variant="secondary"
              className="hover:bg-primary w-full justify-start bg-white hover:text-white"
              onClick={() => handleMenuClick('admission-dashboard')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
          <div className="space-y-1">
            <Button
              variant="secondary"
              className="hover:bg-primary w-full justify-start bg-white hover:text-white"
              onClick={() => handleMenuClick('admission-activities')}
            >
              <ListMinus className="mr-2 h-4 w-4" />
              Activities
            </Button>
          </div>
          <div className="space-y-1">
            <Button
              variant="secondary"
              className="hover:bg-primary w-full justify-start bg-white hover:text-white"
              onClick={() => handleMenuClick('admission-enroll-student')}
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Enroll Student
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
