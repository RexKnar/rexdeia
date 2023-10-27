'use client';

import { Building2, Plus } from 'lucide-react';
import {
  Avatar,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui';

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="ml-4 flex w-52 flex-col rounded-md border border-primary-100 bg-white py-4 shadow-md"
        align="end"
        sideOffset={15}
      >
        <DropdownMenuLabel className="text-sm font-semibold leading-relaxed text-gray-700">
          Select organisation
        </DropdownMenuLabel>
        <DropdownMenuGroup className="w-screen">
          <DropdownMenuItem className="flex items-center space-x-2 p-4 text-sm hover:bg-gray-200">
            <Building2 className="h-5 w-5 text-green-700" />
            <div> organisation</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
          <DropdownMenuItem className="flex items-center space-x-2 p-4 text-sm hover:bg-gray-200">
            <Building2 className="h-5 w-5 text-green-700" />
            <div> organisation</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
          <DropdownMenuItem className="flex items-center space-x-2 p-4 text-sm hover:bg-gray-200">
            <Building2 className="h-5 w-5 text-green-700" />
            <div> organisation</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
          <DropdownMenuItem className="flex cursor-pointer items-center space-x-2 p-4 text-sm">
            <Plus className="h-5 w-5 rounded bg-primary-200 text-primary" />
            <div className="text-primary">Add organisation</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
