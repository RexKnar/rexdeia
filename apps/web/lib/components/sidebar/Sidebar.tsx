'use client';

import { menuItems } from './data';
import { SidebarFooter } from './SidebarFooter';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';

export function Sidebar() {
  return (
    <div className="fixed flex h-screen flex-col border">
      <div className="mt-6 flex-none">
        <SidebarHeader />
      </div>
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-4 ">
          <div className="py-4">
            <div className="mb-2 border">
              <hr />
            </div>
            <div>
              {menuItems.map((item) => (
                <div className="space-y-1 px-4 py-3" key={item.id}>
                  <SidebarItem {...item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <div className="flex-none p-2">
        <SidebarFooter />
      </div>
    </div>
  );
}
