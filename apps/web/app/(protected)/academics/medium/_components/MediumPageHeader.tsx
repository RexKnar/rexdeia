'use client';

import { parseAsBoolean, useQueryState } from 'next-usequerystate';
import React from 'react';
import { Button } from 'ui';

import { PageTitle } from '../../../../../lib/components/PageTitle';

export function MediumPageHeader() {
  const [, setIsMediumFlyoutOpen] = useQueryState(
    'isMediumFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );

  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Medium" />
      <Button
        variant="default"
        onClick={async () => {
          await setIsMediumFlyoutOpen(true);
        }}
      >
        Add Medium
      </Button>
    </section>
  );
}
