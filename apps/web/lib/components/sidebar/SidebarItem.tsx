'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from 'utils';

import { SidebarMenuItem } from './types';

export function SidebarItem(menuItem: SidebarMenuItem) {
  const currentPath = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <Link
        href={menuItem.path}
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        className={cn(
          `flex w-full justify-between rounded-md bg-white p-2 text-sm font-normal text-gray-800 hover:bg-gray-200`,
          currentPath === menuItem.path && `font-bold text-black`
        )}
      >
        <div className="flex">
          {menuItem.icon && <menuItem.icon size={16} className="mr-2" />}
          {menuItem.label}
        </div>
        {menuItem.children &&
          (isExpanded ? (
            <ChevronUp className="mr-2 h-4 w-4" />
          ) : (
            <ChevronDown className="mr-2 h-4 w-4" />
          ))}
      </Link>
      {menuItem.children && isExpanded && (
        <div className={cn('ml-2 w-full overflow-hidden border-l-2 px-2')}>
          {menuItem.children.map((child) => (
            <div
              key={child.id}
              className="w-full p-2 text-sm font-normal text-gray-800"
            >
              <Link
                href={child.path}
                className={cn(
                  `flex w-full rounded-md bg-white p-2 hover:bg-gray-200`,
                  currentPath === child.path && `bg-gray-200 font-semibold`
                )}
              >
                {child.icon && <child.icon size={16} className="mr-2" />}
                {child.label}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
