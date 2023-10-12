'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface FlyoutProps {
  isOpen?: boolean;
  onClose?: () => void;
  width?: string;
  children?: ReactNode; 
}

const Flyout: FC<FlyoutProps> = ({ isOpen, onClose, children, width="" }) => {

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 backdrop-filter backdrop-blur-sm bg-black bg-opacity-20">
          <div className="fixed bg-white p-3 rounded-l-md top-0 right-0 w-[${width}] h-full transform translate-x-0 transition-transform duration-300 ease-in-out" style={{width}}>
            {children}
            <button className="absolute bg-black rounded-full text-white top-1 -left-8 p-[0.4em] flex items-center justify-center opacity-90" onClick={onClose}><X size={14} /></button>
          </div>
        </div>
      )}
    </>
  );
};

export { Flyout };
