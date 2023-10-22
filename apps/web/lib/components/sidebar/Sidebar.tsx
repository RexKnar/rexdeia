'use client';

import { menuItems } from './data';
import { SidebarFooter } from './SidebarFooter';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';

export function Sidebar() {
  return (
    <div className=" flex h-screen flex-col bg-white grow">
      <nav className="flex-1 overflow-y-auto pb-12">
        <section className="space-y-4 py-4">
          <div className="py-2">
            <SidebarHeader />
            <div className="mb-8 w-full border">
            </div>
            <div>
              {menuItems.map((item) => (
                <div className="space-y-1 px-4 py-1" key={item.id}>
                  <SidebarItem {...item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </nav>
      <div className="p-4">
        <SidebarFooter />
      </div>
    </div>
  );
}
