'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type BarConfig = {
  key: string;
  name: string;
  color: string;
};

type AnalyticsBarChartProps = {
  readonly data: any[];
  readonly bars: BarConfig[];
  readonly xKey?: string;
  readonly height?: number;
};

/**
 * A responsive grouped bar chart used across the analytics summary. Unlike the
 * fixed-size BiaxialBarChart, this fills its container so it reads well on any
 * screen size.
 */
export function AnalyticsBarChart({
  data,
  bars,
  xKey = 'name',
  height = 280,
}: AnalyticsBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.color}
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
