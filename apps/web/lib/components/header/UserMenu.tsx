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
        className="w-56 bg-white"
        align="end"
        sideOffset={15}
      >
        <DropdownMenuLabel className="text-gray-700">
          Select organization
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer gap-2 hover:bg-primary hover:text-white">
            <Building2 className="h-5 w-5 text-gray-700" />
            <div> organisation one</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2 hover:bg-primary hover:text-white">
            <Building2 className="h-5 w-5 text-gray-700" />
            <div> organisation two</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2 hover:bg-primary hover:text-white">
            <Building2 className="h-5 w-5 text-gray-700" />
            <div> organisation three</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2 hover:bg-primary hover:text-white">
            <Building2 className="h-5 w-5 text-gray-700" />
            <div> organisation four</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2 hover:bg-primary hover:text-white">
            <Building2 className="h-5 w-5 text-gray-700" />
            <div> organisation five</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
