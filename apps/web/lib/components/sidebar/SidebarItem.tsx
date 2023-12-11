'use client';

import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from 'utils';

import { SidebarMenuItem } from './types';

const variants = {
  expanded: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3 },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export function SidebarItem(menuItem: SidebarMenuItem) {
  const currentPath = usePathname() || '/';
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <motion.div
        className="rounded-md"
        initial={{ scale: 1, backgroundColor: '#FFF' }}
        whileHover={{
          color: '#686868',
          cursor: 'pointer',
          backgroundColor: '#F4F4F4',
          transition: { delay: 0.01 },
        }}
        transition={{ scale: { type: 'spring' }, delay: 0.1 }}
      >
        <Link
          href={menuItem.path}
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          className={cn(
            `flex w-full items-center justify-between rounded-md p-2 text-sm font-normal text-gray-800 hover:text-gray-800`,
            (currentPath === menuItem.path ||
              (menuItem.children &&
                menuItem.children.some(
                  (child) => currentPath === child.path
                ))) &&
              'bg-gray-100 font-semibold text-black'
          )}
        >
          <div className="flex items-center px-3 py-1">
            {menuItem.icon && (
              <menuItem.icon
                size={16}
                className={cn(
                  `mr-2`,
                  (currentPath === menuItem.path ||
                    (menuItem.children &&
                      menuItem.children.some(
                        (child) => currentPath === child.path
                      ))) &&
                    `text-primary`
                )}
              />
            )}
            <div>{menuItem.label}</div>
          </div>
          {menuItem.children && (
            <motion.div
              animate={isExpanded ? 'opened' : 'closed'}
              variants={{
                opened: { rotate: 0 },
                closed: { rotate: -180 },
              }}
              transition={{ duration: 0.3 }}
            >
              <ChevronUp className="h-4 w-4" />
            </motion.div>
          )}
        </Link>
      </motion.div>
      {menuItem.children && (
        <motion.div
          initial="collapsed"
          variants={variants}
          className="ml-2 w-full overflow-hidden px-2"
          animate={isExpanded ? 'expanded' : 'collapsed'}
        >
          {menuItem.children.map((child) => (
            <motion.div
              key={child.id}
              className="mb-1 ml-2 mt-1 rounded-md"
              initial={{ scale: 1, backgroundColor: '#FFF' }}
              whileHover={{
                color: '#686868',
                cursor: 'pointer',
                backgroundColor: '#F4F4F4',
                transition: { delay: 0.001 },
              }}
              transition={{ scale: { type: 'spring' } }}
            >
              <Link
                key={child.id}
                href={child.path}
                className={cn(
                  `flex w-full rounded-md px-4 py-3 text-sm font-normal text-gray-800 hover:text-gray-800`,
                  currentPath === child.path &&
                    `bg-gray-100 font-semibold text-black`
                )}
              >
                {child.icon && (
                  <child.icon
                    size={16}
                    className={cn(
                      `mr-2`,
                      currentPath === child.path && ` text-primary`
                    )}
                  />
                )}
                {child.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
