'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { coolColors } from 'ui';

const RADIAN = Math.PI / 180;

interface RenderCustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: RenderCustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface PieChartWithCustomLabelProps {
  pieData: any[];
  colorCodeIndex: number;
  dataKey?: string;
  nameKey?: string;
}

export function PieChartWithCustomLabel({
  pieData = [],
  colorCodeIndex,
  dataKey = 'value',
  nameKey = 'name',
}: PieChartWithCustomLabelProps) {
  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={Array.isArray(pieData) ? pieData : []} // Ensure pieData is an array
          dataKey={dataKey}
          nameKey={nameKey}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
        >
          {Array.isArray(pieData) &&
            pieData.map((entry, index) => {
              const colorCode =
                entry?.colorCode ||
                coolColors[(index + colorCodeIndex) % coolColors.length];
              return <Cell key={`cell-${index}`} fill={colorCode} />;
            })}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
