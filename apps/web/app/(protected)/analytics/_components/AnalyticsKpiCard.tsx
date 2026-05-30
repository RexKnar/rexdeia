'use client';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from 'utils';

type AnalyticsKpiCardProps = {
  readonly label: string;
  readonly value: number;
  readonly icon: LucideIcon;
  readonly accent?: string;
  readonly hint?: string;
  readonly suffix?: string;
  readonly male?: number;
  readonly female?: number;
};

/**
 * A compact, animated KPI tile for the analytics summary strip. Optionally
 * shows a hint line (e.g. a top scorer's name or a percentage) and a boys /
 * girls split.
 */
export function AnalyticsKpiCard({
  label,
  value,
  icon: Icon,
  accent = 'bg-gray-100 text-gray-700',
  hint,
  suffix,
  male,
  female,
}: AnalyticsKpiCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, { duration: 0.8 });
    return animation.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const hasSplit = typeof male === 'number' || typeof female === 'number';

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-white p-4 shadow-sm transition-all duration-150 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-600">
          {label}
        </span>
        <span className={cn('rounded-full p-1.5', accent)}>
          <Icon size={16} strokeWidth={1.8} />
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <motion.span className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          {rounded}
        </motion.span>
        {suffix && (
          <span className="text-lg font-semibold text-gray-500">{suffix}</span>
        )}
      </div>

      {hint && (
        <p className="truncate text-xs text-gray-500" title={hint}>
          {hint}
        </p>
      )}

      {hasSplit && (
        <div className="flex items-center gap-4 border-t pt-2 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Boys <span className="font-semibold text-gray-900">{male ?? 0}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-pink-500" />
            Girls{' '}
            <span className="font-semibold text-gray-900">{female ?? 0}</span>
          </span>
        </div>
      )}
    </div>
  );
}
