'use client';

import { AnimatePresence } from 'framer-motion';

import { menuItems } from './data';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';

export function Sidebar() {
  return (
    <AnimatePresence>
      <aside className="sm:w-50 fixed flex h-screen flex-col overflow-y-auto border-r bg-white md:w-72">
        <nav>
          <SidebarHeader />
          <div className="mt-14 py-3">
            {menuItems.map((item) => (
              <div className="px-2 py-1" key={item.id}>
                <SidebarItem {...item} />
              </div>
            ))}
          </div>
        </nav>
      </aside>
    </AnimatePresence>
  );
}
