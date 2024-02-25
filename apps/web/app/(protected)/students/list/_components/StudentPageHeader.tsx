'use client';

import { LinkButton } from '@/components/LinkButton';
import { PageTitle } from '@/components/PageTitle';

export function StudentPageHeader() {
  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Students List" className="mb-3" />
      <LinkButton variant="primary" url="enroll-new-student">
        Add New Student
      </LinkButton>
    </section>
  );
}
