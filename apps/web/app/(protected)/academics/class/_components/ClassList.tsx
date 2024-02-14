'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from 'ui';

import { useGetClassListQuery } from '../../../../../lib/queries/class/useGetClassListQuery';
import noClassListImage from '../../../../../public/assets/images/no-classes-list.svg';
import { ClassWidget } from './ClassWidget';

const page = 1;
const limit = 999;

export function ClassList() {
  const router = useRouter();

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

  if (classList.data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 p-6 align-middle">
        <Image alt="icon" width={320} height={320} src={noClassListImage} />
        <div className="flex flex-col items-center gap-1 text-sm">
          <p className="text-base">
            It looks like there are no classes available at the moment.
          </p>
          <p className="text-gray-800">
            Let&lsquo;s get started by creating your first class! Click the
            button below to begin shaping the learning journey.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('class/add')}>
          Get started
        </Button>
      </div>
    );
  }

  return (
    <section className="p-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {classList.data.map((widgetData) => (
          <ClassWidget classDetails={widgetData} key={widgetData.id} />
        ))}
      </div>
    </section>
  );
}
