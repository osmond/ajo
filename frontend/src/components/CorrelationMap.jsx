import React from 'react';
import ChartCard from './ChartCard';
import Skeleton from './ui/Skeleton';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { fetchSteps, fetchSleep, fetchAnalysis, fetchRuns } from '../api';

function mergeStepsSleep(steps, sleep) {
  const map = {};
  for (const s of steps) {
    const d = s.timestamp.slice(0, 10);
    map[d] = { date: d, steps: s.value };
  }
  for (const sl of sleep) {
    const d = sl.timestamp.slice(0, 10);
    map[d] = { ...(map[d] || { date: d }), sleep: sl.value };
  }
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

export default function CorrelationMap() {
  const [data, setData] = React.useState({
    stepsSleep: [],
    hrTemp: [],
    distWeather: [],
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    Promise.all([fetchSteps(), fetchSleep(), fetchAnalysis(), fetchRuns()])
      .then(([steps, sleep, analysis, runs]) => {
        const stepsSleep = mergeStepsSleep(steps, sleep);
        const hrTemp = analysis.map((a, i) => ({
          date: runs[i]?.date || `${i + 1}`,
          hr: a.avgHeartRate,
          temp: a.temperature,
        }));
        const distWeather = runs.map((r, i) => ({
          date: r.date,
          distance: +(r.distance / 1000).toFixed(2),
          temp: analysis[i]?.temperature,
        }));
        setData({ stepsSleep, hrTemp, distWeather });
      })
      .catch(() => setError('Failed to load correlation data'))
      .finally(() => setLoading(false));
  }, []);

  const renderDualLine = (dkey1, dkey2, y1Props, y2Props, dataset) => {
    const grad1 = React.useId();
    const grad2 = React.useId();
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dataset} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id={grad1} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary)/0.7)" />
              <stop offset="100%" stopColor="hsl(var(--primary)/0.2)" />
            </linearGradient>
            <linearGradient id={grad2} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--accent)/0.7)" />
              <stop offset="100%" stopColor="hsl(var(--accent)/0.2)" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
          <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" {...y1Props} />
          <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" {...y2Props} />
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', fontSize: '0.75rem' }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey={dkey1}
            stroke="hsl(var(--primary))"
            fill={`url(#${grad1})`}
            dot={false}
            isAnimationActive={false}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey={dkey2}
            stroke="hsl(var(--accent))"
            fill={`url(#${grad2})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ChartCard key={i} title="">
            <Skeleton className="h-64 w-full" />
          </ChartCard>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-sm font-normal text-destructive">{error}</div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ChartCard title="Steps vs Sleep">
        <div className="h-64">
          {renderDualLine('steps', 'sleep', { unit: '' }, { unit: 'h' }, data.stepsSleep)}
        </div>
      </ChartCard>
      <ChartCard title="HR vs Temperature">
        <div className="h-64">
          {renderDualLine('hr', 'temp', { unit: 'bpm' }, { unit: '°C' }, data.hrTemp)}
        </div>
      </ChartCard>
      <ChartCard title="Distance vs Temperature">
        <div className="h-64">
          {renderDualLine('distance', 'temp', { unit: 'km' }, { unit: '°C' }, data.distWeather)}
        </div>
      </ChartCard>
    </div>
  );
}
