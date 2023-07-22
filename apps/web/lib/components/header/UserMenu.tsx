'use client';

import {
  Avatar,
  AvatarImage,
  DropdownMenu,
  AvatarFallback,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from 'ui';
import { useSession } from 'next-auth/react';

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <Avatar className="cursor-pointer">
        <AvatarImage src="https://github.com/shadcn.png" />
      </Avatar>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{session.user.name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={15}>
        <section className="flex flex-col items-center p-4">
          <Avatar className="h-16 w-16 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{session.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <p className="line-clamp-1 text-base">{session.user.name}</p>
            <p className="line-clamp-1 text-sm text-gray-500">
              {session.user.email}
            </p>
          </div>
        </section>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:bg-primary cursor-pointer hover:text-white">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-primary cursor-pointer hover:text-white">
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
        <DropdownMenuItem className="hover:bg-primary cursor-pointer hover:text-white">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
