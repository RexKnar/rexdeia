'use client';
import React from 'react';

import { PageTitle } from '../../../../../lib/components/PageTitle';

export function ClassPageHeader() {
  return (
    <section className="flex justify-between">
      <PageTitle title="Class List" />
    </section>
  );
}
