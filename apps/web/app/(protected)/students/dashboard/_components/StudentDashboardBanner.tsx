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
    <section className="flex flex-col-reverse items-center justify-between gap-4 rounded-md border bg-primary-300 px-4 py-6 md:flex-row md:px-12 md:py-8">
      <section className="text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
          <p className="text-xl font-semibold md:text-2xl">Explore</p>
          <p className="rounded-md bg-primary-900 px-2 py-1 text-base text-gray-100 md:text-xl">
            Student&apos;s Dashboard
          </p>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-gray-800 md:text-base">
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

      <Image
        alt="Student Dashboard"
        src={studentDashboardImage}
        width={140}
        height={140}
        className="h-28 w-28 object-contain md:h-[186px] md:w-[186px]"
      />
    </section>
  );
}
