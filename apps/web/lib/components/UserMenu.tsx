import { ChevronDown, ChevronRight } from 'lucide-react';
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from 'ui';

import { useGetUserDetailsQuery } from '../queries/useGetUserDetailsQuery';
import Link from 'next/link';

export function UserMenu() {
  const { data, isLoading } = useGetUserDetailsQuery();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <Text variant="sm-medium" className="hidden lg:block">
          Hi, {isLoading ? 'Loading...' : data?.name}
        </Text>
        <ChevronDown className="w-5 h-5 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end" sideOffset={15}>
        <DropdownMenuSeparator className="text-gray-500 bg-gray-100" />
        <DropdownMenuItem
          onClick={async () => {
            await signOut({
              callbackUrl: '/signin',
            });
          }}
          className="flex items-center cursor-pointer"
        >
          <Text variant="sm-medium" className="flex-1">
            Logout
          </Text>
          <ChevronRight
            className="w-5 h-4 bg-gray-200 rounded-full shadow-md stroke-current text-primary"
            stroke-width="1.5"
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator className="text-gray-500 bg-gray-100" />
      <Link href={'/users/profile/'}>
      <DropdownMenuItem     
          className="flex items-center cursor-pointer"
        >
          <Text variant="sm-medium" className="flex-1">
            Profile
          </Text>
          <ChevronRight
            className="w-5 h-4 bg-gray-200 rounded-full shadow-md stroke-current text-primary"
            stroke-width="1.5"
          />
        </DropdownMenuItem></Link>  
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
