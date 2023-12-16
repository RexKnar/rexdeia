'use client';

import { BellDot, Search } from 'lucide-react';
import { Input } from 'ui';

import { UserMenu } from './footer/UserMenu';
import { PathBreadcrumb } from './PathBreadcrumb';

export function PageHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-[64px] items-center justify-center border border-b-gray-200 border-l-transparent bg-white">
      <section className="container mx-auto flex items-center justify-between">
        <PathBreadcrumb />

        <div className="flex items-center gap-6">
          <div className="relative flex items-center">
            <Input
              type="search"
              placeholder="Search"
              className="h-8 bg-gray-50 placeholder:text-gray-800 md:w-80"
            />
            <Search className="absolute right-3 text-gray-600" size={16} />
          </div>
          <BellDot size={20} className="text-gray-700" />
          <UserMenu />
        </div>
      </section>
    </header>
  );
}
