import { Settings } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { UserMenu } from '../header/UserMenu';

export function SidebarHeader() {
  return (
    <div className="mb-2 flex items-center justify-between gap-3 px-4 text-lg font-semibold tracking-tight">
      <div className="flex text-left">
        <UserMenu />
        <div className="ml-2">
          <h1 className="flex items-center text-sm font-semibold">
            ABC College
            <ChevronDown className="ml-2 h-4 w-4 cursor-pointer text-gray-800" />
          </h1>
          <h2 className="text-sm font-normal text-gray-700">Admin</h2>
        </div>
      </div>
      <div className="p-2 ">
        <Settings className="cursor-pointer text-gray-700" />
      </div>
    </div>
  );
}
