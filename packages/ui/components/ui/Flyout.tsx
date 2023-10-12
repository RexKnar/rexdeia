'use client';

import { FC, ReactNode } from 'react';
import { X } from 'lucide-react';

interface FlyoutProps {
  isOpen?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClass = {
  sm: 'w-1/5',
  md: 'w-2/5',
  lg: 'w-3/5',
  xl: 'w-4/5',
};

const Flyout: FC<FlyoutProps> = ({
  isOpen,
  onClose,
  children,
  size = 'sm',
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm backdrop-filter transition-opacity duration-300 ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className={`fixed right-0 top-0 h-full rounded-l-md bg-white p-3 ${
            sizeClass[size]
          } transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {children}
          <button
            className="absolute -left-8 top-1 flex items-center justify-center rounded-full bg-black p-[0.4em] text-white opacity-90"
            onClick={onClose}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

export { Flyout };
