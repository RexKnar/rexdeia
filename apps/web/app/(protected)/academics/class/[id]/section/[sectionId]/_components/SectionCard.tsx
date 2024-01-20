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

export function SectionCard() {
  return (
    <div className="flex bg-white p-3">
      <div className="my-auto w-2/4 px-2">
        <Text variant="base-bold">Section-A</Text>
        <div className="inline-flex">
          <Text variant="base-regular">English</Text>
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
  );
}
