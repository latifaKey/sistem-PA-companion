'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTheme } from '../theme/ThemeProvider';

interface ChartProps {
  data: Array<{
    stage: string;
    progress: number;
    target: number;
  }>;
}

// Color Hunt Palette inspired soft pink & warm terracotta tones
const COLORS = ['#C75C73', '#E37F94', '#F7ABB9', '#F2BF72', '#FAD89E', '#A84157'];

export function ResearchProgressChart({ data }: ChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke={isDark ? '#4D383E' : '#FFF0F3'}
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            unit="%"
            tick={{ fontSize: 11, fill: isDark ? '#FFCED8' : '#863043' }}
          />
          <YAxis
            type="category"
            dataKey="stage"
            width={130}
            tick={{ fontSize: 11, fill: isDark ? '#FFF0F3' : '#3D3133', fontWeight: 600 }}
          />
          <Tooltip
            formatter={(value: any) => [`${value}% Selesai`, 'Progress']}
            contentStyle={{
              borderRadius: '16px',
              border: `1px solid ${isDark ? '#4D383E' : '#FFCED8'}`,
              backgroundColor: isDark ? '#2D2528' : '#FFF9FA',
              fontSize: '12px',
              color: isDark ? '#FFF0F3' : '#3D3133',
              boxShadow: isDark
                ? '0 8px 24px rgba(0, 0, 0, 0.5)'
                : '0 8px 24px rgba(255, 206, 216, 0.3)',
            }}
          />
          <Bar dataKey="progress" radius={[0, 8, 8, 0]} barSize={16}>
            {data.map((_: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
