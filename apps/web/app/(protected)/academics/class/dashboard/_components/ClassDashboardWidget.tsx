'use client';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from 'utils';

interface SubData {
  title: string;
  value: number;
  percentage?: string;
}

interface ClassWidgetProps {
  label: string;
  value: number;
  percentage?: string;
  icon: LucideIcon;
  className?: string;
  subData?: SubData[];
}

export function ClassDashboardWidget({
  label,
  value,
  percentage,
  icon: Icon,
  className,
  subData,
}: ClassWidgetProps) {
  const count = useMotionValue(0);
  const animatedValue = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 1,
      ease: [0.25, 0.1, 0.25, 1],
    });

    return animation.stop;
  }, [count, value]);

  return (
    <div className={cn('rounded-md border border-blue-100 bg-white p-3')}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-black">{label}</h4>
        <div className="rounded-md p-1">
          <Icon
            className={cn(
              'my-auto justify-center rounded-full align-middle',
              className
            )}
          />
        </div>
      </div>

      <div className="mt-4 text-3xl font-semibold text-gray-900">
        <motion.span>{animatedValue}</motion.span>
      </div>

      {percentage && (
        <p className="mt-1 text-xs italic text-gray-500">{percentage}</p>
      )}

      {subData && subData.length > 0 && (
        <div className="mt-4 flex items-center gap-3 border-t pt-3">
          {subData.map((item, idx) => (
            <div
              key={item.title}
              className={cn(
                'flex items-center justify-between py-1.5 text-sm',
                idx === 0 && 'pt-0'
              )}
            >
              <span className="text-gray-600">{item.title}</span>
              <span className="font-medium text-gray-800">
                {item.value}
                {item.percentage && (
                  <span className="ml-1 text-xs text-gray-500">
                    ({item.percentage})
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
