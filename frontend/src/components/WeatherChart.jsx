import React from "react";
import {
  ResponsiveContainer,
  BarChart, Bar,
  XAxis, YAxis, Tooltip
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { weatherData } from "../data/weather";

export default function WeatherChart() {
  return (
    <Card className="bg-background text-foreground">
      <CardHeader className="mb-2">
        <CardTitle>Weather Conditions</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={weatherData}
            margin={{ left: 100, right: 20 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="condition"
              width={120}
              tickLine={false}
              axisLine={false}
              tick={({ x, y, payload }) => {
                const entry = weatherData.find(d => d.condition === payload.value);
                const Icon = entry ? entry.icon : null;
                return (
                  <g transform={`translate(${x - 90},${y - 8})`}>
                    {Icon && <Icon size={16} stroke="hsl(var(--primary))" />}
                    <text x={24} y={12} fill="hsl(var(--primary))" fontSize={12}>
                      {payload.value}
                    </text>
                  </g>
                );
              }}
            />
            <Tooltip
              formatter={value => [`${value} runs`]}
              cursor={{ fill: "hsl(var(--primary) / 0.1)" }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" barSize={20} radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
