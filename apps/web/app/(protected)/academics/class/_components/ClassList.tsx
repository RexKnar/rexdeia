'use client';

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
      <section className="p-3">
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="flex animate-pulse flex-wrap content-start items-start gap-6 self-stretch md:gap-24 md:space-x-24">
            <div className="widget h-full w-full rounded-xl border border-primary-200 bg-white p-4 shadow-md shadow-primary-200">
              <div className="widget-title flex items-center justify-between text-lg font-semibold">
                <div className="h-6 w-1/2 rounded bg-gray-300"></div>
                <div>
                  <div className="w-18 ml-2 inline-block h-5 rounded bg-gray-300"></div>
                  <div className="w-18 ml-2 inline-block h-5 rounded bg-gray-300"></div>
                </div>
              </div>
              <div className="mb-2 mt-4 flex flex-wrap content-center items-center gap-2 self-stretch">
                <div className="h-7 w-7 rounded bg-gray-300"></div>
                <div className="h-7 w-7 rounded bg-gray-300 p-1"></div>
              </div>
            </div>
          </div>
        </section>
      </section>
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
