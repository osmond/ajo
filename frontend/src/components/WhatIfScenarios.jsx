import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Slider } from './ui/Slider';
import { Button } from './ui/Button';
import RunnerIcon from './RunnerIcon';
import { Avatar, AvatarFallback } from './ui/avatar';

export function makeData(sleep, temp, humidity = 50, elevation = 0) {
  const base =
    6 -
    0.1 * (sleep - 7) +
    0.02 * (temp - 20) +
    0.01 * (humidity - 50) +
    0.002 * (elevation / 10);
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
  const pace = data[0]?.pace ?? 6;

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
        <div className="relative h-10 overflow-hidden rounded bg-secondary">
          <motion.div
            data-testid="trail"
            className="absolute left-0 top-1/2 h-1 bg-primary"
            style={{ transform: 'translateY(-50%)' }}
            key={`trail-${pace}`}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: pace, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
          />
          <motion.div
            data-testid="runner"
            className="absolute left-0 top-1/2 -translate-y-1/2"
            key={`runner-${pace}`}
            initial={{ x: '0%' }}
            animate={{ x: '100%' }}
            transition={{ duration: pace, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback>
                <RunnerIcon className="h-6 w-6" aria-label="Runner" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis unit="min/km" stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v) => [`${v} min/km`, 'pace']} />
              <Line type="monotone" dataKey="pace" stroke="hsl(var(--primary))" dot={false}>
                <LabelList dataKey="pace" position="top" formatter={(v) => v.toFixed(2)} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="pace table">
            <thead>
              <tr className="text-muted-foreground">
                <th className="px-2 py-1 text-left">Day</th>
                <th className="px-2 py-1 text-right">Pace</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.day}>
                  <td className="px-2 py-0.5">{d.day}</td>
                  <td className="px-2 py-0.5 text-right">{d.pace} min/km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">Predicted pace over the next 7 days (min/km)</p>
      </CardContent>
    </Card>
  );
}
