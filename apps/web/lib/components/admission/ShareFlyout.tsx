'use client';

import { useState } from 'react';
import { Button, Flyout } from 'ui';

export function ShareFlyout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Flyout isOpen={isModalOpen} onClose={closeModal} width="550px">
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
    </>
  );
}
