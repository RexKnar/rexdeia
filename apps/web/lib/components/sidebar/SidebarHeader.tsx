'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Menu, Plus, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  Avatar,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui';

import { useGetUserDetailsQuery } from '../../queries/useGetUserDetailsQuery';

export function SidebarHeader() {
  const { data, isLoading } = useGetUserDetailsQuery();
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const isMenuOpen = params.get('isMenu') === 'false' ? false : true;
  const [isOpen, setIsOpen] = useState(() => isMenuOpen ?? false);

  return (
    <div className=" flex h-[64px]  items-center justify-between border border-b-gray-200 border-r-transparent bg-white px-4 text-lg font-semibold">
      <div className="flex items-center gap-4 text-left">
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex cursor-pointer text-sm font-semibold">
              {isLoading
                ? 'Loading...'
                : data?.userOrganizations[0]?.organization?.name}
              <ChevronDown className="ml-2 h-4 w-4 rounded text-gray-800 hover:bg-gray-200" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="ml-4 flex w-52 flex-col rounded-md border border-primary-100 bg-white py-4 shadow-md"
            align="end"
            sideOffset={15}
          >
            <DropdownMenuGroup className="w-screen">
              <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
              <DropdownMenuItem className="flex cursor-pointer items-center space-x-2 p-4 text-sm">
                <Plus className="h-5 w-5 rounded bg-primary-200 text-primary" />
                <div className="text-primary">Add organisation</div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-2 ">
        <button
          onClick={() => {
            const isMenuOpen = !isOpen;
            setIsOpen(isMenuOpen);
            const params = new URLSearchParams(searchParams);
            params.set('isMenu', isMenuOpen.toString());

            router.push(pathname + '?' + params.toString());
          }}
          className="lg:hidden"
        >
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X /> : <Menu />}
          </motion.span>
        </button>
      </div>
    </div>
  );
}
