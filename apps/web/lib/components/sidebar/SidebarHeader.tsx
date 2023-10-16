import { Settings } from 'lucide-react';

import { UserMenu } from '../header/UserMenu';

export function SidebarHeader() {
  return (
    <div className="mb-2 flex w-[292px] items-center justify-between gap-3 px-4 text-lg font-semibold tracking-tight">
      <div className="flex w-[140px] text-left">
        <UserMenu />
        <div className="ml-2">
          <h1 className="text-sm font-semibold">ABC College</h1>
          <h2 className="text-sm font-normal text-gray-700">Admin</h2>
        </div>
      </div>
      <div className="flex">
        <Settings className="h-5 w-5 text-gray-700" />
      </div>
    </div>
  );
}
