'use client';

import { menuItems } from './data';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';

export function Sidebar() {
  return (
    <nav className="w-72 border pb-12">
      <section className="space-y-4 py-4">
        <div className="py-2">
          <SidebarHeader />
          <div className="mb-8 w-full border">
            <hr />
          </div>
          <div>
            {menuItems.map((item) => (
              <div className="space-y-1 px-2 py-1" key={item.id}>
                <SidebarItem {...item} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </nav>
  );
}
