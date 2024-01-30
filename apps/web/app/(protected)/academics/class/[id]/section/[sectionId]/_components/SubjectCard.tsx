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

type SubjectCardProps = {
  id: string;
  name: string;
  type: string;
  format: string;
};
export function SubjectCard(props: SubjectCardProps) {
  return (
    <div className="rounded-lg bg-white">
      <div className="flex p-3 pb-0">
        <div className="my-auto w-2/4">
          <Text variant="base-bold">{props.name}</Text>
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
      <div>
        <ul>
          <li
            key={props.id}
            value={props.id}
            className="flex flex-wrap gap-2 p-2"
          >
            <div className="rounded-md bg-sky-200 p-1 text-sm">
              {props.type}
            </div>
            <div className="rounded-md bg-sky-100 p-1 text-sm">
              {props.format}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
