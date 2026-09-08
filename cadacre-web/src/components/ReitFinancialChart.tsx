"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface ChartDataPoint {
  date: string;
  price: number;
}

interface ReitFinancialChartProps {
  data: ChartDataPoint[];
  ticker: string;
}

export function ReitFinancialChart({ data, ticker }: ReitFinancialChartProps) {
  // Determine if stock is up or down over the period
  const isUp = useMemo(() => {
    if (data.length < 2) return true;
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    return lastPrice >= firstPrice;
  }, [data]);

  const strokeColor = isUp ? "#10b981" : "#ef4444"; // emerald-500 or red-500
  const fillColor = isUp ? "#10b981" : "#ef4444";

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center bg-slate-50 border border-slate-100 rounded-xl">
        <p className="text-sm text-slate-500">No historical data available for {ticker}</p>
      </div>
    );
  }

  // Calculate min and max for YAxis domain to make the chart look more dramatic
  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const buffer = (maxPrice - minPrice) * 0.1;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: "#64748b" }} 
            axisLine={false} 
            tickLine={false}
            minTickGap={30}
          />
          <YAxis 
            domain={[minPrice - buffer, maxPrice + buffer]} 
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px' }}
            itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={strokeColor} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
