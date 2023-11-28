'use client';

import { ChevronDown, Settings } from 'lucide-react';

import { useGetUserDetailsQuery } from '../../queries/useGetUserDetailsQuery';
import { UserMenu } from '../header/UserMenu';

export function SidebarHeader() {
  const { data, isLoading } = useGetUserDetailsQuery();

  return (
    <div className="mb-5 flex items-center justify-between gap-3 px-4 text-lg font-semibold tracking-tight">
      <div className="flex items-center gap-4 text-left">
        <UserMenu />
        <div>
          <div className="flex cursor-pointer text-sm font-semibold">
            {isLoading
              ? 'Loading...'
              : data.userOrganizations[0].organization.name}
            <ChevronDown className="ml-2 h-4 w-4 rounded text-gray-800 hover:bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="p-2 ">
        <Settings className="cursor-pointer text-gray-700" />
      </div>
    </div>
  );
}
