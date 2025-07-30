import React from 'react';
import ChartCard from './ChartCard';
import Skeleton from './ui/Skeleton';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
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

  const renderDualLine = (dkey1, dkey2, y1Props, y2Props, dataset) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={dataset} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid stroke="#E5E7EB" strokeWidth={1} horizontal={false} />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" {...y1Props} />
        <YAxis yAxisId="right" orientation="right" {...y2Props} />
        <Tooltip />
        <Line yAxisId="left" type="monotone" dataKey={dkey1} stroke="hsl(var(--primary))" dot={false} isAnimationActive={false} />
        <Line yAxisId="right" type="monotone" dataKey={dkey2} stroke="hsl(var(--accent))" dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );

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
