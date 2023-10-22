import { ChevronDown, Settings } from 'lucide-react';

import { UserMenu } from '../header/UserMenu';

export function SidebarHeader() {
  return (
    <div className="mb-5 flex items-center justify-between gap-3 px-4 text-lg font-semibold tracking-tight">
      <div className="flex items-center gap-4 text-left">
        <UserMenu />
        <div>
          <div className="flex cursor-pointer text-sm font-semibold">
            ABC College
            <ChevronDown className="ml-2 h-4 w-4 rounded text-gray-800 hover:bg-gray-200" />
          </div>
          <div className="text-sm font-normal text-gray-700">Admin</div>
        </div>
      </div>
      <div className="p-2 ">
        <Settings className="cursor-pointer text-gray-700" />
      </div>
    </div>
  );
}
