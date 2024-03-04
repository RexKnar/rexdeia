'use client';

import { FileText } from 'lucide-react';
import dynamic from 'next/dynamic';

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
        <LinkButton variant="primary" url="class/add">
          <FileText size={16} className="mr-2" />
          Add Class
        </LinkButton>
      </section>
      <SaveSectionFlyout />
    </>
  );
}
