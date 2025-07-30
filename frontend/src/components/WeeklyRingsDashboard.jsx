import React from "react";
import { parseISO, startOfWeek, format } from "date-fns";
import { fetchActivities } from "../api";

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

export function groupByWeekByType(activities) {
  const weeks = {};
  for (const act of activities) {
    const date = act.startTimeLocal.split('T')[0];
    const weekStart = format(
      startOfWeek(parseISO(date), { weekStartsOn: 1 }),
      'yyyy-MM-dd'
    );
    const distKm = (act.distance ?? 0) / 1000;
    const entry = (weeks[weekStart] ||= { runKm: 0, bikeKm: 0 });
    const type = act.activityType?.typeKey?.toUpperCase();
    if (type === 'RUN') entry.runKm += distKm;
    else entry.bikeKm += distKm;
  }
  return Object.entries(weeks)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([weekStart, vals]) => ({ weekStart, ...vals }));
}

function polarToCartesian(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
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
    fetchActivities({ limit: 1000 })
      .then((acts) => {
        setWeeks(groupByWeekByType(acts).slice(-weeksToShow));
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
    const runPct = Math.max(0, Math.min(1, w.runKm / goalKm));
    const bikePct = Math.max(0, Math.min(1, w.bikeKm / goalKm));
    const circ = 2 * Math.PI * r;
    const runEnd = -90 + runPct * 360;
    const bikeEnd = runEnd + bikePct * 360;
    return { ...w, r, runPct, bikePct, runEnd, bikeEnd, circ };
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
          const runPath = describeArc(cx, cy, ring.r, -90, ring.runEnd);
          const bikePath = describeArc(cx, cy, ring.r, ring.runEnd, ring.bikeEnd);
          const runLen = ring.circ * ring.runPct;
          const bikeLen = ring.circ * ring.bikePct;
          return (
            <g key={ring.weekStart} data-week={ring.weekStart}>
              {ring.runPct > 0 && (
                <path
                  d={runPath}
                  fill="none"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={strokeWidth}
                  strokeDasharray="0"
                  strokeDashoffset="0"
                  className="animate-draw-ring"
                  style={{ '--dasharray': runLen, '--dashoffset': 0 }}
                />
              )}
              {ring.bikePct > 0 && (
                <path
                  d={bikePath}
                  fill="none"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={strokeWidth}
                  strokeDasharray="0"
                  strokeDashoffset="0"
                  className="animate-draw-ring"
                  style={{ '--dasharray': bikeLen, '--dashoffset': 0 }}
                />
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-sm text-muted-foreground">{label}</figcaption>
    </figure>
  );
}
