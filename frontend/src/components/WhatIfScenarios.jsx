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
import { Slider } from './ui/Slider';
import { Button } from './ui/Button';

export function makeData(sleep, temp, humidity = 50, elevation = 0) {
  const base =
    6 -
    0.1 * (sleep - 7) +
    0.02 * (temp - 20) +
    0.01 * (humidity - 50) / 10 +
    0.002 * elevation / 100;
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
  const [humidity, setHumidity] = React.useState(50);
  const [elevation, setElevation] = React.useState(0);
  const data = React.useMemo(
    () => makeData(sleep, temp, humidity, elevation),
    [sleep, temp, humidity, elevation]
  );

  return (
    <Card className="animate-in fade-in">
      <CardHeader>
        <CardTitle>What If?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="flex-1 text-sm">
            Sleep: {sleep}h
            <Slider
              data-testid="sleep-slider"
              aria-label="Sleep hours"
              min={4}
              max={10}
              step={0.5}
              value={[sleep]}
              onValueChange={(v) => setSleep(v[0])}
            />
          </label>
          <label className="flex-1 text-sm">
            Temp: {temp}°C
            <Slider
              data-testid="temp-slider"
              aria-label="Temperature"
              min={0}
              max={40}
              step={1}
              value={[temp]}
              onValueChange={(v) => setTemp(v[0])}
            />
          </label>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="flex-1 text-sm">
            Humidity: {humidity}%
            <Slider
              data-testid="humidity-slider"
              aria-label="Humidity"
              min={0}
              max={100}
              step={1}
              value={[humidity]}
              onValueChange={(v) => setHumidity(v[0])}
            />
          </label>
          <label className="flex-1 text-sm">
            Elevation: {elevation}m
            <Slider
              data-testid="elevation-slider"
              aria-label="Elevation"
              min={0}
              max={500}
              step={10}
              value={[elevation]}
              onValueChange={(v) => setElevation(v[0])}
            />
          </label>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            setSleep(7);
            setTemp(20);
            setHumidity(50);
            setElevation(0);
          }}
        >
          Reset
        </Button>
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
        <p className="text-sm text-muted-foreground">Predicted pace over the next 7 days (min/km)</p>
      </CardContent>
    </Card>
  );
}
