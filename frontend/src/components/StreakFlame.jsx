import React from 'react';
import { Flame } from 'lucide-react';
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

  const levels = [
    'text-muted-foreground',
    'text-orange-400',
    'text-orange-500',
    'text-red-600',
  ];
  let idx = 0;
  if (days >= 14) idx = 3;
  else if (days >= 7) idx = 2;
  else if (days >= 3) idx = 1;

  const activeClass = days ? 'streak-active' : '';

  return (
    <div className="flex items-center" title={`${days} day streak`}>
      <Flame className={`lucide-flame ${levels[idx]} ${activeClass}`} />
      <span className={`ml-1 text-xs font-medium ${levels[idx]}`}>{days}</span>
    </div>
  );
}
