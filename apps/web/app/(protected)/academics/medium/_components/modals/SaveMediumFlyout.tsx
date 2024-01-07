'use client';

import { parseAsBoolean, useQueryState } from 'next-usequerystate';
import React from 'react';
import { Sheet, SheetContent, Text } from 'ui';

export default function MediumGroupFlyout() {
  const [isOpen, setIsOpen] = useQueryState(
    'isMediumFlyoutOpen',
    parseAsBoolean.withDefault(false)
  );
  const closeFlyout = async () => {
    await setIsOpen(false);
  };

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent
          side="right"
          widthSize="sm"
          className="bg-white p-10"
          onCloseClick={() => closeFlyout()}
        >
          <Text variant="lg-semibold" className="ml-2">
            New Medium
          </Text>
        </SheetContent>
      </Sheet>
    </section>
  );
}
