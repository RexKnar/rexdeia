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
};

export function DashboardWidget({
  value,
  label,
  className,
  icon: Icon,
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
      className={cn(
        'flex w-96 cursor-pointer flex-col gap-4 rounded-md border-[1.5px] bg-white p-4 shadow-sm hover:border-gray-700'
      )}
    >
      <div className="text-sm font-normal text-gray-700">
        {label.toUpperCase()}
      </div>
      <div className="flex items-center justify-between gap-6">
        <motion.div className="text-4xl font-semibold">
          {roundedValue}
        </motion.div>
        <Icon
          size={32}
          strokeWidth={1}
          className={cn('rounded-full', className)}
        />
      </div>
    </section>
  );
}
