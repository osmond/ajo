import React from 'react';
import AnimatedFlame from './AnimatedFlame';
import { fetchDailyTotals } from '../api';

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

  React.useEffect(() => {
    if (count !== undefined) return;
    fetchDailyTotals()
      .then((totals) => setDays(computeStreak(totals)))
      .catch(() => setDays(0));
  }, [count]);

  return (
    <div title={`${days} day streak`}>
      <AnimatedFlame streak={days} />
    </div>
  );
}
