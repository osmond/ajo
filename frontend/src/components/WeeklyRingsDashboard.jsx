import React from "react";
import { parseISO, startOfWeek, format } from "date-fns";
import { fetchDailyTotals } from "../api";

export function groupByWeek(totals) {
  const weeks = {};
  for (const { date, distance } of totals) {
    const weekStart = format(
      startOfWeek(parseISO(date), { weekStartsOn: 1 }),
      "yyyy-MM-dd"
    );
    weeks[weekStart] = (weeks[weekStart] || 0) + distance;
  }
  return Object.entries(weeks)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([weekStart, dist]) => ({ weekStart, distanceKm: dist / 1000 }));
}

export default function WeeklyRingsDashboard({
  goalKm = 40,
  weeksToShow = 4,
  size = 200,
  strokeWidth = 10,
  label = "Weekly Mileage",
}) {
  const [weeks, setWeeks] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchDailyTotals()
      .then((rows) => {
        setWeeks(groupByWeek(rows).slice(-weeksToShow));
      })
      .catch(() => setError("Failed to load"));
  }, [weeksToShow]);

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  const gap = 4;
  const cx = size / 2;
  const cy = size / 2;
  const baseRadius = size / 2 - strokeWidth / 2;
  const rings = [...weeks].reverse().map((w, idx) => {
    const r = baseRadius - idx * (strokeWidth + gap);
    const pct = Math.max(0, Math.min(1, w.distanceKm / goalKm));
    const circ = 2 * Math.PI * r;
    return { ...w, r, pct, circ };
  });

  return (
    <figure className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        data-testid="weekly-rings"
      >
      <style>{`
        @keyframes draw-ring {
          to {
            stroke-dasharray: var(--dasharray);
            stroke-dashoffset: var(--dashoffset);
          }
        }
        .animate-draw-ring {
          animation: draw-ring 1s ease forwards;
        }
      `}</style>
        {rings.map((ring) => {
          const d = `M ${cx} ${cy} m 0 -${ring.r} a ${ring.r} ${ring.r} 0 1 1 0 ${
            ring.r * 2
          } a ${ring.r} ${ring.r} 0 1 1 0 -${ring.r * 2}`;
          return (
            <path
              key={ring.weekStart}
              d={d}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={strokeWidth}
              strokeDasharray="0"
              strokeDashoffset="0"
              className="animate-draw-ring"
              style={{
                '--dasharray': ring.circ,
                '--dashoffset': ring.circ * (1 - ring.pct),
              }}
              transform={`rotate(-90 ${cx} ${cy})`}
              data-week={ring.weekStart}
            />
          );
        })}
      </svg>
      <figcaption className="mt-2 text-sm text-muted-foreground">{label}</figcaption>
    </figure>
  );
}
