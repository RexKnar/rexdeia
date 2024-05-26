'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface chartDataModel {
  chartData: any[];
  firstBarKey?: string;
  secondBarKey?: string;
  collectiveKey?: string;
}

export function BiaxialBarChart({
  chartData,
  firstBarKey,
  secondBarKey,
  collectiveKey,
}: chartDataModel) {
  return (
    <BarChart
      width={500}
      height={300}
      data={chartData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={collectiveKey || 'name'} />
      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey={firstBarKey || 'boy'} fill="#8884d8" />
      <Bar yAxisId="right" dataKey={secondBarKey || 'girl'} fill="#82ca9d" />
    </BarChart>
  );
}
