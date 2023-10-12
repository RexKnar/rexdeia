'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface FlyoutProps {
  isOpen?: boolean;
  onClose?: () => void;
  children?: ReactNode;
}

const Flyout: FC<FlyoutProps> = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm backdrop-filter">
          <div className="fixed right-0 top-0 h-full translate-x-0 transform rounded-l-md bg-white p-3 transition-transform duration-300 ease-in-out sm:w-[550px]">
            {children}
            <button
              className="absolute -left-8 top-1 flex items-center justify-center rounded-full bg-black p-[0.4em] text-white opacity-90"
              onClick={onClose}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export { Flyout };
