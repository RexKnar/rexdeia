'use client';

import { ChevronDown, Plus, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui';

import { useGetUserDetailsQuery } from '../../queries/useGetUserDetailsQuery';
import { UserMenu } from '../header/UserMenu';

export function SidebarHeader() {
  const { data, isLoading } = useGetUserDetailsQuery();

  return (
    <div className="fixed flex h-[64px] w-full items-center justify-between border border-b-gray-200 border-r-transparent bg-white px-4 text-lg font-semibold">
      <div className="flex items-center gap-4 text-left">
        <UserMenu />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex cursor-pointer text-sm font-semibold">
              {isLoading
                ? 'Loading...'
                : data.userOrganizations[0].organization.name}
              <ChevronDown className="ml-2 h-4 w-4 rounded text-gray-800 hover:bg-gray-200" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="ml-4 flex w-52 flex-col rounded-md border border-primary-100 bg-white py-4 shadow-md"
            align="end"
            sideOffset={15}
          >
            <DropdownMenuGroup className="w-screen">
              <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
              <DropdownMenuItem className="flex cursor-pointer items-center space-x-2 p-4 text-sm">
                <Plus className="h-5 w-5 rounded bg-primary-200 text-primary" />
                <div className="text-primary">Add organisation</div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-2 ">
        <Settings className="cursor-pointer text-gray-700" />
      </div>
    </div>
  );
}
