'use client';

import { FileText, Loader2 } from 'lucide-react';

import { LinkButton } from '../../../../../lib/components/LinkButton';
import { useGetClassListQuery } from '../../../../../lib/queries/class/useGetClassListQuery';
import { ClassWidget } from './ClassWidget';

const page = 1;
const limit = 999;

export function ClassList() {
  const { data: classList, isLoading: isClassListLoading } =
    useGetClassListQuery({
      page,
      limit,
    });

  if (isClassListLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-black" />
        <p className=" text-black">Fetching Classes...</p>
      </div>
    );
  }

  return (
    <section className="p-3">
      <div className="w-30 flex justify-end pb-6 pr-1">
        <LinkButton variant="primary" url="class/add">
          <FileText size={16} className="mr-2" />
          Add Class
        </LinkButton>
      </div>
      {classList.data.length ? (
        <div className="flex flex-wrap gap-4">
          {classList.data.map((widgetData) => (
            <ClassWidget classDetails={widgetData} key={widgetData.id} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center">No Classes Found</div>
      )}
    </section>
  );
}
