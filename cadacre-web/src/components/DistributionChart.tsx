"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DistributionHistory } from "@/data/reitSeed";

interface DistributionChartProps {
  data: DistributionHistory[];
}

export function DistributionChart({ data }: DistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorDistribution" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="year" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(val) => `${val}c`}
        />
        <Tooltip
          contentStyle={{ 
            borderRadius: "8px", 
            border: "1px solid hsl(var(--border))", 
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
            fontSize: "13px"
          }}
          formatter={(value: any) => [`${Number(value).toFixed(1)}c`, "Distribution"]}
          labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold", marginBottom: "4px" }}
        />
        <Area 
          type="monotone" 
          dataKey="centsPerUnit" 
          stroke="hsl(221, 83%, 53%)" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorDistribution)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
