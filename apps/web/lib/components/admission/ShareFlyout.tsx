'use client';

import { useState } from 'react';
import {
  Button,
  Flyout,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'ui';

export function ShareFlyout() {
  const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Flyout isOpen={isModalOpen} onClose={closeModal} size="md">
        <div className="text-center">
          <h2 className="border bg-slate-400 p-2 text-white">
            Testing HTML Content
          </h2>
          <p className="mt-6 border bg-red-300 p-2 shadow-md">
            Just testing with some random data!
          </p>
          <p className="border bg-red-300 p-2 shadow-md">
            Just testing with some random data!
          </p>
          <p className="border bg-red-300 p-2 shadow-md">
            Just testing with some random data!
          </p>
        </div>
      </Flyout>
      <Button className="mt-6 text-white" onClick={openModal}>
        Open Modal
      </Button>

      <div className="grid grid-cols-2 gap-2">
        {SHEET_SIDES.map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button variant="outline">{side}</Button>
            </SheetTrigger>
            <SheetContent side={side} className="bg-white">
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <div className="py-4">Hello World!</div>
              </div>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </>
  );
}
