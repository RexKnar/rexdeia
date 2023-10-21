import { ChevronRightSquare, Settings } from 'lucide-react';

import { UserMenu } from '../header/UserMenu';
import { Avatar, AvatarImage } from 'ui/components/ui/Avatar';

export function SidebarHeader() {
  return (
    <div className="mb-5 flex items-center justify-between gap-3 px-4 text-lg font-semibold tracking-tight">
      <div className="flex items-center gap-4 text-left">
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
        </Avatar>
        <div>
          <div className="text-sm font-semibold">ABC College</div>
          <div className="text-sm font-normal text-gray-700">Admin</div>
        </div>
      </div>
      <div className="flex">
        <Settings className="h-5 w-5 text-gray-700" />
      </div>
    </div>
  );
}
