'use client';

import { parseAsBoolean, useQueryState } from 'next-usequerystate';
import React from 'react';
import { Button } from 'ui';

import { PageTitle } from '../../../../../lib/components/PageTitle';

export function BatchesPageHeader() {
  const [, setIsFlyoutOpen] = useQueryState(
    'isFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );

  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Batches" />
      <Button
        variant="default"
        onClick={async () => {
          await setIsFlyoutOpen(true);
        }}
      >
        Add Batch
      </Button>
    </section>
  );
}
