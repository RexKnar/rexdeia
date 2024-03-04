'use client';

import dynamic from 'next/dynamic';

import { PageTitle } from '@/components/PageTitle';

const ExamConfigureFlyout = dynamic(() =>
  import('../_modals/ExamConfigureFlyout').then(
    (mod) => mod.ExamConfigureFlyout
  )
);

export function PageHeader() {
  return (
    <>
      <section className="flex justify-between px-2">
        <PageTitle title="Create New Exam" />
      </section>
      <ExamConfigureFlyout />
    </>
  );
}
