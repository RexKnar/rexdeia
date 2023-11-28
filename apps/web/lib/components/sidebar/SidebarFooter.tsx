'use client';

import { Avatar, AvatarImage } from 'ui';

import { useGetUserDetailsQuery } from '../../queries/useGetUserDetailsQuery';
import { UserMenu } from '../footer/UserMenu';

export function SidebarFooter() {
  const { data, isLoading } = useGetUserDetailsQuery();

  return (
    <div className="mb-2 flex items-center justify-between gap-3 px-4 text-lg font-semibold tracking-tight">
      <div className="flex w-[140px] text-left">
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://imgv3.fotor.com/images/gallery/Realistic-Male-Profile-Picture.jpg" />
        </Avatar>
        <div className="ml-2">
          <h1 className="line-clamp-1 text-sm font-semibold">
            {isLoading ? 'Loading...' : data.name}
          </h1>
          <div className="text-sm font-normal text-gray-700">Admin</div>
        </div>
      </div>
      <div>
        <UserMenu />
      </div>
    </div>
  );
}
