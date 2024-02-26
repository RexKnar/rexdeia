'use client';

import { LinkButton } from '@/components/LinkButton';
import { PageTitle } from '@/components/PageTitle';

export function ExamsPageHeader() {
  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Exam List" />
      <LinkButton variant="primary" url="exams/add">
        Add Exam
      </LinkButton>
    </section>
  );
}
