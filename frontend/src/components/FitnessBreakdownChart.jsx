import React from "react";
import ChartCard from "./ChartCard";
import Skeleton from "./ui/Skeleton";
import { fetchSteps, fetchSleep, fetchHeartrate } from "../api";

export default function FitnessBreakdownChart({ size = 200, strokeWidth = 12 }) {
  const [metrics, setMetrics] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function load() {
      try {
        const [steps, sleep, hr] = await Promise.all([
          fetchSteps(),
          fetchSleep(),
          fetchHeartrate(),
        ]);
        const latestSteps = steps[steps.length - 1]?.value ?? 0;
        const lastSleep = sleep[sleep.length - 1]?.value ?? 0;
        const avgHr = Math.round(
          hr.reduce((s, p) => s + p.value, 0) / (hr.length || 1)
        );
        setMetrics([
          { label: "Steps", value: latestSteps, goal: 10000, color: "hsl(var(--primary))" },
          { label: "Sleep", value: lastSleep, goal: 8, color: "hsl(var(--accent))" },
          { label: "HR Avg", value: avgHr, goal: 100, color: "hsl(var(--muted-foreground))" },
        ]);
      } catch (err) {
        setError("Failed to load");
      }
    }
    load();
  }, []);

  const gap = 4;
  const cx = size / 2;
  const cy = size / 2;
  const baseRadius = size / 2 - strokeWidth / 2;
  const rings = metrics.map((m, idx) => {
    const r = baseRadius - idx * (strokeWidth + gap);
    const pct = Math.max(0, Math.min(1, m.value / m.goal));
    const circ = 2 * Math.PI * r;
    return { ...m, r, pct, circ };
  });

  return (
    <ChartCard title="Fitness Breakdown">
      <div className="flex justify-center items-center h-60">
        {!metrics.length && !error && (
          <Skeleton className="h-40 w-40 rounded-full" />
        )}
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
        {metrics.length > 0 && (
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            data-testid="fitness-rings"
          >
            <style>{`@keyframes fill-ring { to { stroke-dashoffset: 0; } }`}</style>
            {rings.map((ring) => (
              <circle
                key={ring.label}
                cx={cx}
                cy={cy}
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeDasharray={ring.circ}
                strokeDashoffset={ring.circ * (1 - ring.pct)}
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ animation: "fill-ring 1s ease forwards" }}
              />
            ))}
          </svg>
        )}
      </div>
    </ChartCard>
  );
}
