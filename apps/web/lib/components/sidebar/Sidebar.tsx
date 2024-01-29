'use client';

import { AnimatePresence } from 'framer-motion';

import { menuItems } from './data';
import { SidebarFooter } from './SidebarFooter';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';

export function Sidebar() {
  return (
    <AnimatePresence>
      <aside className="fixed flex h-screen w-72 flex-col overflow-y-auto border-r bg-white">
        <nav className=" h-full">
          <SidebarHeader />
          <div className="flex h-full flex-col justify-between space-y-4">
            <div className="mt-14 py-3">
              {menuItems.map((item) => (
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
