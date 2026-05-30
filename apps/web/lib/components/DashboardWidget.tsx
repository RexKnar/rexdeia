'use client';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from 'utils';

type StudentWidgetProps = {
  readonly value: number;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly className?: string;
  readonly onClick?: () => void;
};

export function DashboardWidget({
  value,
  label,
  className,
  icon: Icon,
  onClick,
}: StudentWidgetProps) {
  const count = useMotionValue(0);
  const roundedValue = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 1,
    });

    return animation.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      onClick={onClick}
      className={cn(
        'flex w-full max-w-xs flex-col gap-4 rounded-md border-[1.5px] bg-white p-4 shadow-sm transition-all duration-150 hover:border-gray-700 sm:max-w-sm md:max-w-md lg:w-96',
        onClick && 'cursor-pointer hover:border-primary hover:shadow-md'
      )}
    >
      <div className="text-sm font-medium tracking-wide text-gray-700">
        {label.toUpperCase()}
      </div>

      <div className="flex items-center justify-between gap-4 sm:gap-6">
        <motion.div className="text-3xl font-semibold text-gray-900 sm:text-4xl">
          {roundedValue}
        </motion.div>
        <Icon
          size={28}
          strokeWidth={1.2}
          className={cn('rounded-full text-gray-600', className)}
        />
      </div>
    </section>
  );
}
