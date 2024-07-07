import { ChevronDown, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { data, isLoading } = useGetUserDetailsQuery();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://imgv3.fotor.com/images/gallery/Realistic-Male-Profile-Picture.jpg" />
        </Avatar>
        <Text variant="sm-medium" className="hidden lg:block">
          Hi, {isLoading ? 'Loading...' : data.name}
        </Text>
        <ChevronDown className="h-5 w-5 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end" sideOffset={15}>
        <DropdownMenuItem
          onClick={() => router.push('/users/profile')}
          className="flex cursor-pointer items-center"
        >
          <Text variant="sm-medium" className="flex-1">
            Profile
          </Text>
          <ChevronRight
            className="h-4 w-5 rounded-full bg-gray-200 stroke-current text-primary shadow-md"
            stroke-width="1.5"
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
        <DropdownMenuItem
          onClick={async () => {
            await signOut({
              callbackUrl: '/signin',
            });
          }}
          className="flex cursor-pointer items-center"
        >
          <Text variant="sm-medium" className="flex-1">
            Logout
          </Text>
          <ChevronRight
            className="h-4 w-5 rounded-full bg-gray-200 stroke-current text-primary shadow-md"
            stroke-width="1.5"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
