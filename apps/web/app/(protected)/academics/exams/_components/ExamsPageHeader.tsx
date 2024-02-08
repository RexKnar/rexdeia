'use client';

import { Button } from 'ui';

import { PageTitle } from '../../../../../lib/components/PageTitle';

export function ExamsPageHeader() {
  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Exam List" />
      <Button variant="default">Add Exam</Button>
    </section>
  );
}
