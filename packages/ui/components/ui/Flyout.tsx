'use client';

import { FC, useEffect, useState } from 'react';
import { Button } from './Button';
import { Cross, X } from 'lucide-react';

interface FlyoutProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Flyout: FC<FlyoutProps> = ({ isOpen, onClose }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(isOpen || false);
  }, [isOpen]);

  const closeFlyout = () => {
    setModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-filter backdrop-blur-sm bg-black bg-opacity-20">
          <div className="fixed bg-white p-3 rounded-l-md top-0 right-0 sm:w-[550px] h-full transform translate-x-0 transition-transform duration-300 ease-in-out">
            
            <button className="absolute bg-black rounded-full text-white top-1 -left-8 p-[0.4em] flex items-center justify-center opacity-90" onClick={closeFlyout}><X size={14}/></button>
          </div>
        </div>
      )}
    </>
  );
};

export { Flyout };
