'use client';

import { BellDot, Search } from 'lucide-react';
import { Input } from 'ui';

import { UserMenu } from './footer/UserMenu';
import { PathBreadcrumb } from './PathBreadcrumb';

export function PageHeader() {
  return (
    <section className="bg-white">
      <header className="container mx-auto flex items-center justify-between border-b-gray-200 py-2">
        <PathBreadcrumb />

        <div className="flex items-center gap-6">
          <div className="relative flex items-center">
            <Input
              type="search"
              className="h-8 w-auto items-stretch bg-gray-50 p-1 placeholder:text-gray-800 md:w-80"
              placeholder="Search"
            />
            <Search className="absolute right-3 text-gray-600" size={16} />
          </div>
          <BellDot size={20} className="text-gray-700" />
          <UserMenu />
        </div>
      </header>
    </section>
  );
}
