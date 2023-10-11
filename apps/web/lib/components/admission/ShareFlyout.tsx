'use client';

import { useState } from 'react';
import { Button, Flyout } from 'ui';

export function ShareFlyout() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Flyout isOpen={isModalOpen} onClose={closeModal} />
      <Button className="mt-6 text-white" onClick={openModal}>
        Open Modal
      </Button>
    </>
  );
}
