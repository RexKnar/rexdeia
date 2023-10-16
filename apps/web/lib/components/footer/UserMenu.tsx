import { ChevronRight, MoreVertical } from 'lucide-react';
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui';

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="mr-2 h-4 w-4 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-white"
        align="end"
        sideOffset={15}
      >
        <DropdownMenuItem className="flex cursor-pointer items-center">
          <span className="flex-1">Profile</span>
          <ChevronRight className="ml-2 rounded-full bg-gray-300 p-1 text-blue-500" />
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
        <DropdownMenuItem
          className="flex cursor-pointer items-center"
          onClick={async () => {
            await signOut({
              callbackUrl: '/signin',
            });
          }}
        >
          <span className="flex-1">Logout</span>
          <ChevronRight className="ml-2 rounded-full bg-gray-300 p-1 text-blue-500" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
