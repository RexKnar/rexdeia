'use client';

import { Button } from 'ui';

import { PageTitle } from '@/components/PageTitle';

export function ExamTypePageHeader() {
  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Exam Type" />
      <Button variant="default">Add Exam Type</Button>
    </section>
  );
}
