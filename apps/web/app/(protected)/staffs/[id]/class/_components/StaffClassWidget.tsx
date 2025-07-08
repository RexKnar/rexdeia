'use client';

import { useGetStudentListByClassIdQuery } from 'lib/queries/students/useGetStudentListByClassIdQuery';
import { Badge } from 'ui';
import { cn } from 'utils';

import { LinkButton } from '@/components/LinkButton';

export function StaffClassWidget({ classDetails }) {
  const { data: studentListResponse } = useGetStudentListByClassIdQuery(
    classDetails.id,
    {
      enabled: !!classDetails.id,
    }
  );
  return (
    <div className="flex flex-wrap content-start items-start gap-6 self-stretch md:gap-24 md:space-x-24">
      <div className="widget h-full w-full rounded-xl border border-primary-200 bg-white p-4 shadow-md shadow-primary-200">
        <div className="widget-title flex items-center justify-between text-lg font-semibold">
          <LinkButton
            className={cn('ps-0 text-lg font-semibold')}
            url={`./class/${classDetails.id}`}
          >
            {classDetails.name}
          </LinkButton>
          <div>
            <Badge className={cn('mb-2 bg-yellow-100')}>
              Students:&nbsp;
              {studentListResponse ? studentListResponse.length : '-'}
            </Badge>
          </div>
        </div>
        <div className="mb-2 mt-4 flex flex-wrap content-center items-center gap-2 self-stretch">
          {classDetails.sections.map((section, index) => (
            <LinkButton
              key={index}
              className={cn(
                'h-7 w-7 text-center',
                'bg-primary text-white hover:bg-primary'
              )}
              url={`/academics/class/${classDetails.id}/section/${section.id}`}
            >
              {section.name}
            </LinkButton>
          ))}
        </div>
      </div>
    </div>
  );
}
