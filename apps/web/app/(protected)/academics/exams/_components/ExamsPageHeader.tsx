'use client';

import { LinkButton } from '../../../../../lib/components/LinkButton';
import { PageTitle } from '../../../../../lib/components/PageTitle';

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
