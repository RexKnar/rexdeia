'use client';

import { useGetBatchesListQuery } from 'lib/queries/batches/useGetBatchesListQuery';
import { ChevronDown, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarTrigger,
} from 'ui';

export function ChooseBatch() {
  const router = useRouter();
  const pathname = usePathname();
  const [batchList, setBatchList] = useState([]);
  // const router = useRouter();
  const { data: sessionData } = useSession();
  const { data: batchListResponse, isLoading } = useGetBatchesListQuery({
    page: 1,
    limit: 10,
    filter: { currentAcademicYear: true },
  });

  useEffect(() => {
    setBatchList(batchListResponse?.data ?? []);
  }, [batchListResponse]);

  const handleSessionUpdate = async (batchId: string) => {
    try {
      router.push(`/workspace?currentBatch=${batchId}&callBackUrl=${pathname}`);
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  };

  return (
    <div className=" flex h-[64px]  items-center justify-between border border-b-gray-200 border-r-transparent bg-white px-4 text-lg font-semibold">
      <div className="flex items-center gap-4 text-left">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex cursor-pointer text-sm font-semibold">
              {isLoading
                ? 'Loading...'
                : batchList?.length > 0
                  ? batchList.find(
                      (obj) => obj.id === sessionData?.currentBatch
                    )?.name
                  : 'Choose a Batch'}
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
              {batchList?.map((batch) => (
                <DropdownMenuItem
                  key={batch.id}
                  className="flex cursor-pointer items-center space-x-2 p-4 text-sm"
                  onClick={() => handleSessionUpdate(batch.id)}
                >
                  <Plus className="h-5 w-5 rounded bg-primary-200 text-primary" />
                  <div className="text-primary">{batch.name}</div>
                </DropdownMenuItem>
              ))}
              {/* <DropdownMenuItem className="flex items-center p-4 space-x-2 text-sm cursor-pointer">
                <Plus className="w-5 h-5 rounded bg-primary-200 text-primary" />
                <div className="text-primary">Add organisation</div>
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-2 lg:hidden">
        {/* <button
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
        </button> */}
        <SidebarTrigger />
      </div>
    </div>
  );
}
