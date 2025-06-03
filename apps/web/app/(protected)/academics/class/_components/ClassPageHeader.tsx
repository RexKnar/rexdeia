'use client';
import dynamic from 'next/dynamic';
import { Button } from 'ui';

import { LinkButton } from '@/components/LinkButton';
import { PageTitle } from '@/components/PageTitle';

const SaveSectionFlyout = dynamic(() =>
  import('../[classId]/section/[sectionId]/_modals/SaveSectionFlyout').then(
    (mod) => mod.SaveSectionFlyout
  )
);

export function ClassPageHeader() {
  return (
    <>
      <section className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="text-xl font-semibold text-gray-800">
          <PageTitle title="Class List" />
        </div>
        <form className="flex flex-row items-stretch gap-2 sm:items-center">
          <input
            type="file"
            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 sm:w-auto"
          />
          <Button variant="default">Upload Class</Button>
        </form>
        <div>
          <LinkButton variant="primary" url="class/add">
            Add Class
          </LinkButton>
        </div>
      </section>
      <SaveSectionFlyout />
    </>
  );
}
