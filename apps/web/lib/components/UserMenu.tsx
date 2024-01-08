import { ChevronDown } from 'lucide-react';
import { signOut } from 'next-auth/react';
import {
  Avatar,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from 'ui';

import { useGetUserDetailsQuery } from '../queries/useGetUserDetailsQuery';

export function UserMenu() {
  const { data, isLoading } = useGetUserDetailsQuery();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://imgv3.fotor.com/images/gallery/Realistic-Male-Profile-Picture.jpg" />
        </Avatar>
        <Text variant="sm-medium">
          Hi, {isLoading ? 'Loading...' : data.name}
        </Text>
        <ChevronDown className="h-5 w-5 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end" sideOffset={15}>
        <DropdownMenuItem className="flex cursor-pointer items-center">
          <span className="flex-1">Profile</span>
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
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
