import { useGetSectionByIdQuery } from 'lib/queries/section/useGetSectionByIdQuery';
import { useGetStudentListBySectionIdQuery } from 'lib/queries/students/useGetStudentListBySectionIdQuery';
import { Loader2, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
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

type SectionCardProps = {
  id: string;
  name: string;
  classId: string;
};

export function SectionCard({ classId, id, name }: SectionCardProps) {
  const router = useRouter();
  const handleCardClick = (event: React.MouseEvent) => {
    router.push(`/academics/class/${classId}/section/${id}`);
    event.stopPropagation();
  };
  const { data: studentList } = useGetStudentListBySectionIdQuery(id, {
    enabled: !!id,
  });
  const { data: SectionDetails, isLoading: isSectionDetailsLoading } =
    useGetSectionByIdQuery(id, {
      enabled: !!id,
    });
  return (
    <div
      className="h-full flex-col bg-white p-3"
      onClick={(event) => handleCardClick(event)}
    >
      <div className="flex">
        <div className="my-auto w-2/4 px-2">
          <Text variant="base-bold">{name}</Text>
        </div>

        <div className="my-auto w-2/4 ">
          <div className="float-end my-auto justify-end p-1">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="mild" className="h-8 px-1">
                  <MoreHorizontal className="text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-white"
                align="end"
                sideOffset={15}
              >
                <DropdownMenuItem
                  className="flex cursor-pointer items-center"
                  onClick={() => {}}
                >
                  <span className="flex-1">Reassign</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100 text-gray-500" />
                <DropdownMenuItem
                  className="flex cursor-pointer items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <span className="flex-1">Remove</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <hr className="border-1 border-gray-400" />
      <div className="mt-2 flex flex-wrap">
        <Badge className={cn('mb-2 bg-yellow-100')}>
          Students: &nbsp;{studentList ? studentList.length : '-'}
        </Badge>

        {isSectionDetailsLoading ? (
          <Loader2 className="mr-2 h-6 w-6 animate-spin justify-center text-indigo-700" />
        ) : SectionDetails ? (
          SectionDetails.group.map((group) => (
            <Badge key={group.id} className={cn('mb-2')}>
              {group.name}
            </Badge>
          ))
        ) : (
          'No group found'
        )}
      </div>
    </div>
  );
}
