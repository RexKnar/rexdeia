import { MoreHorizontal } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from 'ui';

export function SubjectCard() {
  return (
    <div className="rounded-lg bg-white">
      <div className="flex p-3 pb-0">
        <div className="my-auto w-2/4">
          <Text variant="base-bold">Subject Name</Text>
          <div className="inline-flex">
            <Text variant="base-regular">staff Name</Text>
          </div>
        </div>
        <div className="my-auto w-2/4 ">
          <div className="float-end my-auto justify-end p-1">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                <Button variant="mild" className="h-8 px-1">
                  <MoreHorizontal className="text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-white"
                align="end"
                sideOffset={15}
              >
                <DropdownMenuItem className="flex cursor-pointer items-center">
                  <span className="flex-1">Reassign</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
                <DropdownMenuItem className="flex cursor-pointer items-center">
                  <span className="flex-1">Remove</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap p-3 ">
        <span className="me-2 mt-2 rounded bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          SUB1032
        </span>
        <span className="me-2 mt-2 rounded bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
          English
        </span>
        <span className="me-2 mt-2 rounded bg-red-300 p-2 px-2 py-1 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
          curriculum
        </span>
        <span className="me-2 mt-2 rounded bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          100Marks
        </span>
        <span className="me-2 mt-2 rounded bg-pink-100 px-2 py-1 text-sm font-medium text-pink-800 dark:bg-pink-900 dark:text-pink-300">
          67%
        </span>
      </div>
    </div>
  );
}
