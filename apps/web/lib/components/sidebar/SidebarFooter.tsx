import { Avatar, AvatarImage } from 'ui';

import { UserMenu } from '../footer/UserMenu';

export function SidebarFooter() {
  return (
    <div className="mb-2 flex w-[292px] items-center justify-between gap-3 px-4 text-lg font-semibold tracking-tight">
      <div className="flex w-[140px] text-left">
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://imgv3.fotor.com/images/gallery/Realistic-Male-Profile-Picture.jpg" />
        </Avatar>
        <div className="ml-2">
          <h1 className="text-sm font-semibold">John doe</h1>
          <h2 className="text-sm font-normal text-gray-700">Role</h2>
        </div>
      </div>
      <div className="h-4 w-4 ">
        <UserMenu />
      </div>
    </div>
  );
}
