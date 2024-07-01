'use client';

import { AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { menuItem } from './data';
import { SidebarFooter } from './SidebarFooter';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';

export function Sidebar() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string>('User');
  useEffect(() => {
    setUserRole(session?.user?.role);
  }, [session, status]);

  const menus = menuItem[userRole] || [];
  return (
    <AnimatePresence>
      <aside className="fixed flex h-screen w-72 flex-col overflow-y-auto border-r bg-white">
        <nav className="h-full ">
          <SidebarHeader />
          <div className="flex h-full flex-col justify-between space-y-4">
            <div className="mt-14 py-3">
              {menus.map((item) => (
                <div className="px-2 py-1" key={item.id}>
                  <SidebarItem {...item} />
                </div>
              ))}
            </div>
            <div>
              <SidebarFooter />
            </div>
          </div>
        </nav>
      </aside>
    </AnimatePresence>
  );
}
