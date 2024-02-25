'use client';

import { LinkButton } from '@/components/LinkButton';
import { PageTitle } from '@/components/PageTitle';

export function StaffPageHeader() {
  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Staff List" className="mb-3" />
      <LinkButton variant="primary" url="onboard-new-staff">
        Add New Staff
      </LinkButton>
    </section>
  );
}
