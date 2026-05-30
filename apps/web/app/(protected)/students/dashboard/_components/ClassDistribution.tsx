import type { ClassBreakdown } from '../../../../api/student/service';

type ClassDistributionProps = {
  readonly classes: ClassBreakdown[];
  readonly onSelectClass?: (classId: string, className: string) => void;
};

function pct(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Class-wise distribution of active students for the selected academic year,
 * rendered as a stacked bar (boys / girls / others) per class with counts.
 */
export function ClassDistribution({
  classes,
  onSelectClass,
}: ClassDistributionProps) {
  if (classes.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        No class-wise data available for this academic year.
      </p>
    );
  }

  const max = Math.max(...classes.map((c) => c.total), 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-700">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          Boys
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
          Girls
        </span>
      </div>

      {classes.map((klass) => {
        const boysPct = pct(klass.boys, klass.total);
        const girlsPct = pct(klass.girls, klass.total);
        const othersPct = Math.max(0, 100 - boysPct - girlsPct);

        return (
          <div
            key={klass.classId}
            onClick={() =>
              onSelectClass?.(klass.classId, klass.className)
            }
            className={
              onSelectClass
                ? 'flex cursor-pointer items-center gap-3 rounded-md p-1 transition-colors hover:bg-gray-50'
                : 'flex items-center gap-3'
            }
          >
            <span className="w-28 shrink-0 truncate text-sm text-gray-700">
              {klass.className}
            </span>

            <div
              className="flex h-2.5 overflow-hidden rounded-full bg-gray-100"
              style={{ width: `${Math.round((klass.total / max) * 100)}%` }}
            >
              <div
                className="h-full bg-blue-500"
                style={{ width: `${boysPct}%` }}
              />
              <div
                className="h-full bg-pink-500"
                style={{ width: `${girlsPct}%` }}
              />
              {klass.others > 0 && (
                <div
                  className="h-full bg-gray-400"
                  style={{ width: `${othersPct}%` }}
                />
              )}
            </div>

            <span className="flex shrink-0 items-center gap-2 text-sm text-gray-700">
              <span className="font-semibold text-blue-600">{klass.boys}</span>
              <span className="text-gray-300">/</span>
              <span className="font-semibold text-pink-600">{klass.girls}</span>
              {klass.others > 0 && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="font-semibold text-gray-500">
                    {klass.others}
                  </span>
                </>
              )}
              <span className="ml-1 w-8 text-right font-semibold text-gray-900">
                {klass.total}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
