import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

export default function ProgressRing({
  value = 0,
  max = 100,
  size = 40,
  unit = "",
  className = "",
}) {
  const percent = Math.max(0, Math.min(1, value / max)) * 100;
  const data = [{ name: "progress", value: percent }];
  const gradientId = React.useId();

  return (
    <div className={"relative " + className} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--accent))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
          </defs>
          <RadialBar
            background
            dataKey="value"
            minAngle={15}
            clockWise
            cornerRadius={9999}
            fill={`url(#${gradientId})`}
            isAnimationActive
            animationDuration={500}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold leading-none">{value}</span>
        {unit && (
          <span className="text-xs text-muted-foreground">{unit}</span>
        )}
      </div>
    </div>
  );
}
