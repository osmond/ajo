import React from "react";
import { fetchSteps, fetchHeartrate, fetchSleep } from "../api";
import Skeleton from "./ui/Skeleton";

// Angle and color definitions for the dial zones. These are reused for the
// legend so the colors stay in sync.
const ZONES = [
  { label: "Poor", start: -90, end: -90 + 144, color: "hsl(var(--destructive))" },
  { label: "Average", start: -90 + 144, end: -90 + 252, color: "hsl(var(--accent))" },
  { label: "Great", start: -90 + 252, end: 270, color: "hsl(var(--primary))" },
];

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

function Dial({ score, size = 120 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 10;
  // ZONES provides the arc angles and colors. Only the geometry data is
  // needed here for rendering the segments.
  const zones = ZONES.map(({ start, end, color }) => ({ start, end, color }));
  const needleAngle = -90 + (score / 100) * 360;
  const needle = polarToCartesian(cx, cy, r - 8, needleAngle);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {zones.map((z, i) => (
        <path
          key={i}
          d={describeArc(cx, cy, r, z.start, z.end)}
          stroke={z.color}
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
        />
      ))}
      <line
        x1={cx}
        y1={cy}
        x2={needle.x}
        y2={needle.y}
        stroke="currentColor"
        strokeWidth={3}
      />
      <circle cx={cx} cy={cy} r={4} className="fill-current" />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xl font-bold fill-foreground"
      >
        {score}
      </text>
    </svg>
  );
}

export default function FitnessScoreDial() {
  const [score, setScore] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function load() {
      try {
        const [steps, hr, sleep] = await Promise.all([
          fetchSteps(),
          fetchHeartrate(),
          fetchSleep(),
        ]);
        const lastSteps = steps[steps.length - 1]?.value ?? 0;
        const avgHr =
          hr.reduce((s, p) => s + p.value, 0) / (hr.length || 1);
        const lastSleep = sleep[sleep.length - 1]?.value ?? 0;

        const stepsScore = Math.min(1, lastSteps / 10000);
        const sleepScore = Math.min(1, lastSleep / 8);
        const hrScore = 1 - Math.min(1, Math.max(0, (avgHr - 60) / 40));
        const composite = Math.round(
          (stepsScore * 0.4 + sleepScore * 0.3 + hrScore * 0.3) * 100
        );
        setScore(composite);
      } catch (err) {
        setError("Failed to load score");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Skeleton className="h-24 w-24 rounded-full" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-40 text-sm text-destructive">
        {error}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-40 gap-2">
      <div className="text-sm font-medium text-muted-foreground">Fitness Score</div>
      <Dial score={score} />
      <div className="flex items-center gap-4 text-sm mt-1" data-testid="score-legend">
        {ZONES.map((z) => (
          <div key={z.label} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: z.color }}></span>
            <span>{z.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
