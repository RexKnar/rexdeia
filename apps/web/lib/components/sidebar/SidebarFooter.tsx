'use client';

import { Avatar, AvatarImage } from 'ui';

import { UserMenu } from '../footer/UserMenu';
import { useSession } from 'next-auth/react';

export function SidebarFooter() {
  const session = useSession();
  if (session.status === 'loading') {
    return null;
  }
  return (
    <div className="mb-2 flex items-center justify-between gap-3 px-4 text-lg font-semibold tracking-tight">
      <div className="flex w-[140px] text-left">
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://imgv3.fotor.com/images/gallery/Realistic-Male-Profile-Picture.jpg" />
        </Avatar>
        <div className="ml-2">
          <h1 className="text-sm font-semibold">{session.data.user.name}</h1>
          <div className="text-sm font-normal text-gray-700">Admin</div>
        </div>
      </div>
      <div>
        <UserMenu />
      </div>
    </div>
  );
}
