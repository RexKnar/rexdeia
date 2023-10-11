'use client';

import { useState } from 'react';
import { Button, Flyout } from 'ui';

export function FlyoutModal() {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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
