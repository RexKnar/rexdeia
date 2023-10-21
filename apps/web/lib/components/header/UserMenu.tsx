'use client';

import { Building2 } from 'lucide-react';
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
        className="ml-6 flex w-[258px] flex-col items-start rounded-md border border-primary-100 bg-white py-4 shadow-md"
        align="end"
        sideOffset={15}
      >
        <DropdownMenuLabel className="text-base font-medium leading-relaxed text-gray-700">
          Select organisation
        </DropdownMenuLabel>
        <DropdownMenuGroup className="w-screen">
          <DropdownMenuItem className="flex items-center space-x-2 px-6 text-base font-medium leading-relaxed hover:bg-gray-200">
            <Building2 className="h-5 w-5 text-gray-700" />
            <div> organisation one</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center space-x-2 px-6 text-base font-medium leading-relaxed hover:bg-gray-200">
            <Building2 className="h-5 w-5 text-gray-700" />
            <div> organisation two</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center space-x-2 px-6 text-base font-medium leading-relaxed hover:bg-gray-200">
            <Building2 className="h-5 w-5 text-gray-700" />
            <div> organisation three</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center space-x-2 px-6 text-base font-medium leading-relaxed hover:bg-gray-200">
            <Building2 className="h-5 w-5 text-gray-700" />
            <div> organisation four</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center space-x-2 px-6 text-base font-medium leading-relaxed hover:bg-gray-200">
            <Building2 className="h-5 w-5 text-gray-700" />
            <div> organisation five</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
