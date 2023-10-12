'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
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

const Flyout: FC<FlyoutProps> = ({ isOpen, onClose, children, size = 'sm' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  return isOpen ? (
    <div
      className={`fixed inset-0 backdrop-filter backdrop-blur-sm bg-black bg-opacity-20 transition-opacity duration-300 ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`fixed bg-white p-3 rounded-l-md top-0 right-0 h-full ${sizeClass[size]} transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {children}
        <button
          className="absolute bg-black rounded-full text-white top-1 -left-8 p-[0.4em] flex items-center justify-center opacity-90"
          onClick={onClose}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  ) : null;
};

export { Flyout };
