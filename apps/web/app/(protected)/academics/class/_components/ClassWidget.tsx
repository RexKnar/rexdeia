'use client';

import { Plus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'ui';
import { cn } from 'utils';

export function ClassWidget(props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-wrap content-start items-start gap-6 self-stretch md:gap-24 md:space-x-24">
      <div className="widget h-full w-full rounded-xl border border-primary-200 bg-white p-4 shadow-md shadow-primary-200">
        <div className="widget-title  flex items-center justify-between text-lg font-semibold">
          <Button
            className={cn('ps-0 text-lg font-semibold')}
            variant="ghost"
            onClick={() => {
              router.push(`class/${props.classDetails.id}`);
            }}
          >
            {props.classDetails.name}
          </Button>
          <div>
            <Button
              variant="outline"
              className={cn(
                'w-18 ml-2 h-5 rounded-lg border-none  bg-blue-100 px-2 py-1 text-center text-sm font-medium text-indigo-700'
              )}
            >
              Students
            </Button>
            <Button
              variant="outline"
              className={cn(
                'w-18 ml-2 h-5 rounded-lg border-none  px-2 py-1 text-center text-sm font-medium text-teal-800',
                props.classDetails.isActive ? 'bg-teal-100' : 'bg-red-300'
              )}
            >
              {props.classDetails.isActive ? 'Active' : 'Inactive'}
            </Button>
          </div>
        </div>
        <div className="mb-2 mt-4 flex flex-wrap content-center items-center gap-2 self-stretch">
          {props.classDetails.Section.map((section, index) => (
            <Button
              key={index}
              className={cn(
                'h-7 w-7 text-center',
                section.isActive
                  ? 'bg-primary text-white hover:bg-primary'
                  : 'bg-gray-400 text-black hover:bg-gray-400'
              )}
              onClick={() => {
                router.push(
                  `/academics/class/${props.classDetails.id}/section/${section.id}`
                );
              }}
            >
              {section.name}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-7 w-7 rounded p-1"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set('isSectionFlyoutOpen', 'true');
              params.set('classId', props.classDetails.id);

              router.replace(pathname + '?' + params.toString());
            }}
          >
            <Plus height={24} width={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}
