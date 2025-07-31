import React from 'react';
import AnimatedFlame from './AnimatedFlame';
import { fetchDailyTotals } from '../api';
import Tooltip from './ui/tooltip';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export function computeStreak(totals = []) {
  const dates = new Set(totals.map((t) => t.date));
  let streak = 0;
  const dayMs = 86400000;
  let d = new Date();
  d.setHours(0, 0, 0, 0);
  while (dates.has(d.toISOString().split('T')[0])) {
    streak += 1;
    d = new Date(d.getTime() - dayMs);
  }
  return streak;
}

export default function StreakFlame({ count }) {
  const [days, setDays] = React.useState(count ?? 0);
  const [miles, setMiles] = React.useState([]);

  React.useEffect(() => {
    if (count !== undefined) return;
    fetchDailyTotals()
      .then((totals) => {
        const streak = computeStreak(totals);
        setDays(streak);
        const slice = totals.slice(-streak).map((t) => ({ value: t.distance / 1000 }));
        setMiles(slice);
      })
      .catch(() => {
        setDays(0);
        setMiles([]);
      });
  }, [count]);

  const flame = (
    <div aria-label={`${days} day streak`} className="flex items-center gap-1">
      <AnimatedFlame streak={days} />
      {miles.length > 0 && (
        <div className="h-4 w-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={miles} margin={{ top: 2, bottom: 2 }}>
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="none" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
  return <Tooltip text={`${days} day streak`}>{flame}</Tooltip>;
}
