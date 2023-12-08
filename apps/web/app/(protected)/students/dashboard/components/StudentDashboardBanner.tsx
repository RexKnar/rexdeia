'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import studentDashboardImage from '../../../../../public/assets/images/student-dashboard.svg';

export function StudentDashboardBanner() {
  const text =
    'Comprehensive statistics highlighting trends and related areas.'.split(
      ' '
    );

  return (
    <section className="flex items-center justify-between rounded-md border bg-primary-300 px-12 py-8">
      <section>
        <div className="flex gap-1">
          <p className="text-2xl font-semibold">Explore</p>
          <p className="rounded-md bg-primary-900 px-2 text-xl text-gray-100">
            Student&apos;s Dashboard
          </p>
        </div>
        <p className="text-gray-90000">
          {text.map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              {el}{' '}
            </motion.span>
          ))}
        </p>
      </section>
      <Image alt="icon" width={186} height={186} src={studentDashboardImage} />
    </section>
  );
}
