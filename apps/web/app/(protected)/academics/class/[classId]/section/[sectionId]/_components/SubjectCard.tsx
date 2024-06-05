import { MoreHorizontal } from 'lucide-react';
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

type SubjectCardProps = {
  id: string;
  name: string;
  type?: string;
  assessmentFormat?: string;
};
export function SubjectCard({ id, name }: SubjectCardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <div className="rounded-lg bg-white">
      <div className="flex p-3 pb-0">
        <div className="my-auto w-2/4">
          <Text variant="base-bold">{name}</Text>
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
                    Reassign
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
                <DropdownMenuItem className="flex cursor-pointer items-center">
                  <Button variant="link" size="sm" className="flex-1">
                    Remove
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
                <DropdownMenuItem className="flex cursor-pointer items-center">
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
