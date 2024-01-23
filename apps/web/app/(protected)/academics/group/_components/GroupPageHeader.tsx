'use client';

import { parseAsBoolean, useQueryState } from 'next-usequerystate';
import React from 'react';
import { Button } from 'ui';

import { PageTitle } from '../../../../../lib/components/PageTitle';

export function GroupPageHeader() {
  const [, isGroupFlyoutOpen] = useQueryState(
    'isGroupFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );

  return (
    <section className="flex justify-between px-2">
      <PageTitle title="Group" />
      <Button
        variant="default"
        onClick={async () => {
          await isGroupFlyoutOpen(true);
        }}
      >
        Add Group
      </Button>
    </section>
  );
}
