/* eslint-disable prettier/prettier */
import { staffInchargesModel } from 'lib/domain/section';
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
} from 'ui';
import { cn } from 'utils';

import { LinkButton } from '@/components/LinkButton';

type SectionCardProps = {
  id: string;
  name: string;
  classId: string;
  staffIncharges:staffInchargesModel[];
};

export function SectionCard({
  classId,
  id,
  name,
  staffIncharges,
}: SectionCardProps) {
  const router = useRouter();
  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
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
      className="flex-col h-full p-3 bg-white"
      onClick={(event) => handleCardClick(event)}
    >
      <div className="flex">
        <div className="w-2/4 px-2 my-auto">
          <LinkButton
            className={'base-bold'}
            url={`/academics/class/${classId}/section/${id}`}
          >
            {name}
          </LinkButton>
        </div>

        <div className="w-2/4 my-auto ">
          <div className="justify-end p-1 my-auto float-end">
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
                  className="flex items-center cursor-pointer"
                  onClick={() => {}}
                >
                  <span className="flex-1">Reassign</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="text-gray-500 bg-gray-100" />
                <DropdownMenuItem
                  className="flex items-center cursor-pointer"
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
      <hr className="border-gray-400 border-1" />
      <div className="flex flex-wrap mt-2">
        <Badge className={cn('mb-2 bg-yellow-100')}>
          Students: &nbsp;{studentList ? studentList.length : '-'}
        </Badge>

        {isSectionDetailsLoading ? (
          <Loader2 className="justify-center w-6 h-6 mr-2 text-indigo-700 animate-spin" />
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
      {staffIncharges.length > 0 ? (
        <div className="mt-2">
          <h4 className="mb-2 text-sm font-semibold">Incharge:</h4>
          {staffIncharges.map((staff) => (
            <Badge key={staff.id} className={cn('mb-2')}>
              {staff.firstName} {staff.middleName} {staff.lastName}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-gray-500">No Incharge Assigned</p>
      )}
    </div>
  );
}
