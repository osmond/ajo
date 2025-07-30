import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { temperatureData } from "../data/temperature";

export default function TemperatureChart() {
  return (
    <Card className="bg-background text-foreground">
      <CardHeader className="mb-2">
        <CardTitle>Temperature</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={temperatureData}
            layout="vertical"
            margin={{ left: 100, right: 20, top: 20, bottom: 20 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="label"
              type="category"
              width={120}
              tickLine={false}
              axisLine={false}
              tick={({ x, y, payload }) => {
                const entry = temperatureData.find(d => d.label === payload.value);
                const range = entry ? entry.range : "";
                return (
                  <text
                    x={x - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize={12}
                    fill="#334155"
                  >
                    {payload.value}
                    <tspan fill="#64748B">  {range}</tspan>
                  </text>
                );
              }}
            />
            <Tooltip
              formatter={val => [`${val} runs`, ""]}
              cursor={{ fill: "rgba(156, 163, 175, 0.1)" }}
            />
            <Bar
              dataKey="count"
              fill="#111827"
              barSize={20}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

