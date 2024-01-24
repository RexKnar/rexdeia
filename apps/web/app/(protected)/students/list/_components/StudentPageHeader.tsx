'use client';

import React from 'react';

import { LinkButton } from '../../../../../lib/components/LinkButton';
import { PageTitle } from '../../../../../lib/components/PageTitle';

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
