'use client';

import { AnimatePresence } from 'framer-motion';

import { menuItems } from './data';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';

export function Sidebar() {
  return (
    <AnimatePresence>
      <div className="fixed left-0 top-0 flex h-screen w-72 grow flex-col bg-white">
        <nav className="flex-1 overflow-y-auto">
          <section className="h-full space-y-4 py-4">
            <div className="py-2">
              <SidebarHeader />
              <div className="w-full border"></div>
              <div className="py-3">
                {menuItems.map((item) => (
                  <div className="px-2 py-1" key={item.id}>
                    <SidebarItem {...item} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </nav>
      </div>
    </AnimatePresence>
  );
}
