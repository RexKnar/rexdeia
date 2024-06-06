import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Text } from 'ui';
import { cn } from 'utils';

type StudentWidgetProps = {
  readonly value: number | string;
  readonly percentage: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly className?: string;
  readonly subData?: {
    title?: string;
    value: string | number;
    percentage: string;
  }[];
};

export function BasicAnalyticsCardWidget({
  value,
  label,
  percentage,
  className,
  icon: Icon,
  subData,
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
    <div className="rounded-md border border-blue-100 bg-white p-3 ">
      <div className="flex">
        <div className="flex justify-center align-middle">
          <Icon
            size={32}
            strokeWidth={1}
            className={cn(
              'my-auto justify-center rounded-full align-middle',
              className
            )}
          />
        </div>
        <div className="ml-4 ">
          <span className="text-xs text-gray-900">{label}</span>
          <Text className="text-xl">
            <motion.span className="font-bold ">{roundedValue}</motion.span>
            <span className="font-semibold ">({percentage})</span>
          </Text>
        </div>
      </div>
      <div className="border-s-1 flex ">
        <div className="flex">
          {subData?.map(
            ({
              title: subTitle = '',
              value: subValue,
              percentage: subPercentage = '',
            }) => (
              <div
                key={subValue}
                className="text-md flex items-center justify-between px-4 py-2 text-gray-700"
              >
                <span className="text-xs text-gray-700">
                  {subTitle || ''} :
                </span>

                <h4>
                  <span className="font-bold">
                    {subValue} ({subPercentage})
                  </span>
                </h4>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
