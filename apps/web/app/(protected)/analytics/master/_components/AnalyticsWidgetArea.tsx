import { ArrowUp10 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { BasicAnalyticsCardWidget } from '../../_components/BasicAnalyticsCardWidget';

export default function AnalyticsWidgetArea(props: any) {
  const { markDetails } = props;
  const [analyticsWidgetData, setAnalyticsWidgetData] = useState([]);
  useEffect(() => {
    if (markDetails) {
      const { analytics } = markDetails;

      const widgetData = [
        {
          value: analytics?.totalCount || 0,
          percentage: '-',
          label: 'Total Count',
          icon: ArrowUp10,
          className: 'bg-green-100 text-green-800',
          subData: [
            {
              title: 'Male',
              value: analytics.totalMale || 0,
              percentage: `${analytics.totalMalePercentage} %`,
            },
            {
              title: 'Female',
              value: analytics.totalFemale || 0,
              percentage: `${analytics.totalFemalePercentage} %`,
            },
          ],
        },
      ];
      setAnalyticsWidgetData(widgetData);
    }
  }, [markDetails]);
  return (
    <section className="mt-4 space-y-4 rounded-md bg-white p-6">
      <div className="flex gap-2">
        {analyticsWidgetData.map((widget, index) => (
          <div
            key={index + widget.percentage + widget.label}
            className="w-full"
          >
            <BasicAnalyticsCardWidget
              icon={widget.icon}
              percentage={widget.percentage}
              label={widget.label}
              value={widget.value}
              className={widget.className}
              subData={widget.subData}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
