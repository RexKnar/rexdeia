'use client';
import { useSession } from 'next-auth/react';
import { Suspense, useEffect, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarRail,
} from 'ui/components/ui/Sidebar';

import { ChooseBatch } from './ChooseBatch';
import { instituteMenu, menuItem } from './data';
import { SidebarFooter } from './SidebarFooter';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';

export function AppSidebar() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string>('User');
  const [organizationType, setOrganizationType] = useState<string>('school');
  useEffect(() => {
    setUserRole(session?.user?.role);
    setOrganizationType(session?.institute);
  }, [session, status]);

  const menus =
    organizationType == 'others'
      ? instituteMenu[userRole] || []
      : menuItem[userRole] || [];

  return (
    <Sidebar className="bg-white">
      <SidebarHeader />
      <Suspense>
        <ChooseBatch />
      </Suspense>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menus.map((item) => (
                <div className="px-2 py-1" key={item.id}>
                  <SidebarItem {...item} />
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
