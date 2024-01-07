'use client';

import { parseAsBoolean, useQueryState } from 'next-usequerystate';
import React from 'react';
import { Sheet, SheetContent } from 'ui';

export default function SaveGroupFlyout() {
  const [isOpen, setIsOpen] = useQueryState(
    'isGroupFlyoutOpen',
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
          Group
        </SheetContent>
      </Sheet>
    </section>
  );
}
