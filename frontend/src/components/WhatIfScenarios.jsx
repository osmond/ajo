import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

export function makeData(sleep, temp) {
  const base = 6 - 0.1 * (sleep - 7) + 0.02 * (temp - 20);
  const data = [];
  for (let i = 1; i <= 7; i++) {
    const pace = +(base + (i - 4) * 0.01).toFixed(2);
    data.push({ day: i, pace });
  }
  return data;
}

export default function WhatIfScenarios() {
  const [sleep, setSleep] = React.useState(7);
  const [temp, setTemp] = React.useState(20);
  const data = React.useMemo(() => makeData(sleep, temp), [sleep, temp]);

  return (
    <Card className="animate-in fade-in">
      <CardHeader>
        <CardTitle>What If?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="flex-1 text-sm">
            Sleep: {sleep}h
            <input
              data-testid="sleep-slider"
              type="range"
              min="4"
              max="10"
              step="0.5"
              value={sleep}
              onChange={(e) => setSleep(parseFloat(e.target.value))}
              className="w-full"
            />
          </label>
          <label className="flex-1 text-sm">
            Temp: {temp}°C
            <input
              data-testid="temp-slider"
              type="range"
              min="0"
              max="40"
              step="1"
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis unit="min/km" stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v) => [`${v} min/km`, 'pace']} />
              <Line type="monotone" dataKey="pace" stroke="hsl(var(--primary))" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
