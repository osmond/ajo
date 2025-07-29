import React from "react";
import ChartCard from "./ChartCard";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from "recharts";
import Skeleton from "./ui/Skeleton";
import { fetchSteps } from "../api";

function StepTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const date = label.split("T")[0];
  return (
    <div className="rounded bg-background p-2 text-sm font-normal shadow">
      <div>{date}</div>
      <div className="flex items-center gap-1">
        <span>🚶</span>
        <span>{value} steps</span>
      </div>
    </div>
  );
}

export default function StepsSparkline() {
  const [steps, setSteps] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const gradientId = React.useId();
  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue('--color-accent').trim();
  const primary = styles.getPropertyValue('--primary').trim();

  React.useEffect(() => {
    fetchSteps()
      .then(setSteps)
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ChartCard title="Step Trend">
      <div className="h-40">
        {loading && <Skeleton className="h-full w-full" />}
        {error && (
          <div className="flex h-full items-center justify-center text-sm font-normal text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={steps} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={primary} stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tick={false} />
              <YAxis />
              <Tooltip content={<StepTooltip />} />
              <ReferenceLine y={10000} stroke={primary} strokeDasharray="3 3" label={{ position: 'right', value: 'Goal' }} />
              <Area type="monotone" dataKey="value" stroke={primary} fill={`url(#${gradientId})`} dot={false} />
              <Brush dataKey="timestamp" height={20} travellerWidth={10} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
