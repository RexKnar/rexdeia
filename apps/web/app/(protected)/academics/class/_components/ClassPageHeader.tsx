'use client';

import { FileText } from 'lucide-react';

import { LinkButton } from '../../../../../lib/components/LinkButton';
import { PageTitle } from '../../../../../lib/components/PageTitle';

export function ClassPageHeader() {
  return (
    <section className="flex justify-between">
      <PageTitle title="Class List" />
      <LinkButton variant="primary" url="class/add">
        <FileText size={16} className="mr-2" />
        Add Class
      </LinkButton>
    </section>
  );
}
