import { FC } from 'react'
import 'tailwindcss/tailwindcss';
import { Button } from './Button';

interface FlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const Flyout: FC<FlyoutProps> = 
({ isOpen, onClose}) => {
  return (
    <>
    { isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="animate-slideInRight bg-white p-6rounded-lg">
          { /* Content goes here */}
          <Button onClick={onClose} >Close</Button>
        </div>
      </div>
    )}
    </>
  )
}