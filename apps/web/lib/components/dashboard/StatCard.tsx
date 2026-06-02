import { LucideIcon } from 'lucide-react';
import { cn } from 'utils';

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
  hint?: string;
};

/** Compact, non-animated stat tile reused across the admin dashboards. */
export function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'bg-gray-100 text-gray-700',
  hint,
}: StatCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-md border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-600">
          {label}
        </span>
        <span className={cn('rounded-full p-1.5', accent)}>
          <Icon size={16} strokeWidth={1.8} />
        </span>
      </div>
      <span className="text-2xl font-semibold text-gray-900">{value}</span>
      {hint && <p className="truncate text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
