'use client';

import { Search } from 'lucide-react';
import { Input } from 'ui';

import { NotificationPopover } from './notification/NotificationPopover';
import { PathBreadcrumb } from './PathBreadcrumb';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { UserMenu } from './UserMenu';

export function PageHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-[64px] w-full  border border-b-gray-200 border-l-transparent bg-white ">
      <section className="mx-auto flex w-full items-center justify-between ">
        <SidebarHeader />
        <div>
          <PathBreadcrumb />
        </div>

        <div className="flex items-center gap-6">
          <div className="relative flex hidden items-center lg:block">
            <Input
              type="search"
              placeholder="Search"
              className="h-8 w-auto bg-gray-50 placeholder:text-gray-800 md:w-80"
            />
            <Search className="absolute right-3 text-gray-600" size={16} />
          </div>
          <NotificationPopover />
          <UserMenu />
        </div>
      </section>
    </header>
  );
}
