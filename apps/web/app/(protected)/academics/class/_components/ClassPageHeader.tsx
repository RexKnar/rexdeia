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
      <section className="flex justify-between">
        <PageTitle title="Class List" />
        <form className="flex items-center gap-2 rounded-md border border-gray-200 p-2">
          <input type="file" />
          <Button variant="outline">Upload Class</Button>
        </form>
        <LinkButton variant="primary" url="class/add">
          Add Class
        </LinkButton>
      </section>
      <SaveSectionFlyout />
    </>
  );
}
