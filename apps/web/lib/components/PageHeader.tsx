'use client';

import { Search } from 'lucide-react';
import { Suspense } from 'react';
import { Input } from 'ui';

import { NotificationPopover } from './notification/NotificationPopover';
import { PathBreadcrumb } from './PathBreadcrumb';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { UserMenu } from './UserMenu';

export function PageHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-[64px] w-full  border border-b-gray-200 border-l-transparent bg-white print:hidden ">
      <section className="flex items-center justify-between w-full mx-auto ">
        <Suspense fallback={<div>Loading...</div>}>
          <SidebarHeader />
        </Suspense>

        <div>
          <PathBreadcrumb />
        </div>

        <div className="flex items-center gap-6">
          <div className="relative flex items-center hidden lg:block">
            <Input
              type="search"
              placeholder="Search"
              className="w-auto h-8 bg-gray-50 placeholder:text-gray-800 md:w-80"
            />
            <Search className="absolute text-gray-600 right-3" size={16} />
          </div>
          <NotificationPopover />
          <UserMenu />
        </div>
      </section>
    </header>
  );
}
