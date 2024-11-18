'use client';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from 'ui';

type StudentCardProps = {
  id: string;
  name: string;
};

export function StudentCard(props: StudentCardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <div className="flex bg-white p-3">
      <div className="my-auto w-3/4 px-2">
        <Text variant="base-bold">{props.name}</Text>
      </div>
      <div className="my-auto w-1/4 ">
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
                <span className="flex-1">
                  <Link href={`/students/${props.id}/editStudent`}>Edit</Link>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center">
                <span className="flex-1">
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('isReassignStudentFlyoutOpen', 'true');
                      params.set('studentId', props.id);

                      router.replace(pathname + '?' + params.toString());
                    }}
                  >
                    Re-Assign
                  </button>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center">
                <span className="flex-1">
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('isArchiveStudentFlyoutOpen', 'true');
                      params.set('studentId', props.id);

                      router.replace(pathname + '?' + params.toString());
                    }}
                  >
                    Archive/Transfer
                  </button>
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
