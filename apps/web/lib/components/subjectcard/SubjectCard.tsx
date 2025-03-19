/* eslint-disable prettier/prettier */
import { MoreHorizontal } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from 'ui';
import { cn } from 'utils';

type SubjectCardProps = {
  id: string;
  name: string;
  type?: string;
  assessmentFormat?: string;
  staffNames?: string;
};
export function SubjectCard({ id, name,staffNames }: SubjectCardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <div className="bg-white rounded-lg">
      <div className="flex p-3 pb-0">
        <div className="w-2/4 my-auto">
          <Text variant="base-bold">{name}</Text>
          <div className="inline-flex">
            {staffNames &&
              staffNames.split(", ").map((staff, index) => (
                <Badge key={index} className={cn('mb-2')}>
                  {staff}
                </Badge>
              ))}
          </div>
        </div>
        <div className="w-2/4 my-auto ">
          <div className="justify-end p-1 my-auto float-end">
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
                <DropdownMenuItem className="flex items-center cursor-pointer">
                  <Button
                    variant="link"
                    size="sm"
                    className="flex-1"
                    onClick={async () => {
                      const params = new URLSearchParams(searchParams);
                      params.set('isAssignSubjectToStudentFlyout', 'true');
                      params.set('subjectId', id);
                      params.set('subjectName', name);
                      router.replace(pathname + '?' + params.toString());
                    }}
                  >
                    Assign elective
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="text-gray-500 bg-gray-100" />
                <DropdownMenuItem className="flex items-center cursor-pointer">
                  <Button
                    variant="link"
                    size="sm"
                    className="flex-1"
                    onClick={async () => {
                      const params = new URLSearchParams(searchParams);
                      params.set('isAddSubjectFlyoutOpen', 'true');
                      params.set('subjectId', id);

                      router.replace(pathname + '?' + params.toString());
                    }}
                  >
                    Edit
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="text-gray-500 bg-gray-100" />
                <DropdownMenuItem className="flex items-center cursor-pointer">
                  <Button
                    variant="link"
                    size="sm"
                    className="flex-1"
                    onClick={async () => {
                      const params = new URLSearchParams(searchParams);
                      params.set('isDeleteConfirmationModalOpen', 'true');
                      params.set('subjectId', id);
                      params.set('subjectName', name);
                      router.replace(pathname + '?' + params.toString());
                    }}
                  >
                    Remove
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
