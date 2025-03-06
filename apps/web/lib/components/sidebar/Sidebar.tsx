'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { menuItem } from './data';
import { SidebarFooter } from './SidebarFooter';
import { SidebarItem } from './SidebarItem';

export function Sidebar() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string>('User');
  useEffect(() => {
    setUserRole(session?.user?.role);
  }, [session, status]);

  const menus = menuItem[userRole] || [];
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const isMenuOpen = params.get('isMenu') === 'false' ? false : true;
  const [isOpen, setIsOpen] = useState(() => isMenuOpen ?? false);

  useEffect(() => {
    setIsOpen(isMenuOpen);
  }, [isMenuOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="sidebar"
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="fixed left-0 top-0 z-40 flex h-[vh] h-screen w-72 flex-col overflow-y-auto border-r bg-white shadow-lg lg:bottom-0 lg:z-0 print:hidden"
        >
          <nav className="h-full ">
            <div className="flex h-full flex-col justify-between space-y-4">
              <div className="mt-14 py-3">
                {menus.map((item) => (
                  <div className="px-2 py-1" key={item.id}>
                    <SidebarItem {...item} />
                  </div>
                ))}
              </div>
              <div>
                <SidebarFooter />
              </div>
            </div>
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
