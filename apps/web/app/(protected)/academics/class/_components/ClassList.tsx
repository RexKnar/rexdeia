'use client';

import { Loader2 } from 'lucide-react';

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
      {classList.data.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
