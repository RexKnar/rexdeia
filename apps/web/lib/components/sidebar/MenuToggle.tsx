'use client';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export const MenuToggle = () => {
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const isMenuOpen = params.get('isMenu') === 'false' ? false : true;
  const [isOpen, setIsOpen] = useState(() => isMenuOpen ?? false);

  return (
    <button
      onClick={() => {
        const isMenuOpen = !isOpen;
        setIsOpen(isMenuOpen);
        const params = new URLSearchParams(searchParams);
        params.set('isMenu', isMenuOpen.toString());

        router.push(pathname + '?' + params.toString());
      }}
    >
      <motion.span
        initial={{ rotate: 0 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? <X /> : <Menu />}
      </motion.span>
    </button>
  );
};
