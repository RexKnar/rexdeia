import { cn } from 'utils';

type GenderSplitCardProps = {
  readonly title: string;
  readonly total: number;
  readonly boys: number;
  readonly girls: number;
  readonly others?: number;
  readonly highlight?: boolean;
  readonly onClick?: () => void;
};

function pct(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * A card showing a student count with its boys / girls (and optional "others")
 * split, used both for per-medium breakdowns and the overall gender ratio.
 */
export function GenderSplitCard({
  title,
  total,
  boys,
  girls,
  others = 0,
  highlight = false,
  onClick,
}: GenderSplitCardProps) {
  const boysPct = pct(boys, total);
  const girlsPct = pct(girls, total);
  const othersPct = Math.max(0, 100 - boysPct - girlsPct);

  return (
    <section
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-4 rounded-md border-[1.5px] bg-white p-5 shadow-sm transition-all duration-150 hover:border-gray-700',
        highlight && 'border-primary-200 bg-primary-300/40',
        onClick && 'cursor-pointer hover:border-primary hover:shadow-md'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-semibold tracking-wide text-gray-700">
          {title.toUpperCase()}
        </span>
        <span className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          {total}
        </span>
      </div>

      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-full bg-blue-500" style={{ width: `${boysPct}%` }} />
        <div className="h-full bg-pink-500" style={{ width: `${girlsPct}%` }} />
        {others > 0 && (
          <div
            className="h-full bg-gray-400"
            style={{ width: `${othersPct}%` }}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        <span className="flex items-center gap-2 text-gray-700">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          Boys
          <span className="font-semibold text-gray-900">{boys}</span>
        </span>
        <span className="flex items-center gap-2 text-gray-700">
          <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
          Girls
          <span className="font-semibold text-gray-900">{girls}</span>
        </span>
        {others > 0 && (
          <span className="flex items-center gap-2 text-gray-700">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
            Others
            <span className="font-semibold text-gray-900">{others}</span>
          </span>
        )}
      </div>
    </section>
  );
}
