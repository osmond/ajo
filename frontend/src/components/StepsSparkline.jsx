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
    <div className="rounded border border-border bg-background p-2 text-sm font-normal shadow">
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
  const primary = 'hsl(var(--primary))';
  const accent = 'var(--accent)';

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
              <CartesianGrid stroke="#E5E7EB" strokeWidth={1} strokeDasharray="4 4" />
              <XAxis dataKey="timestamp" tick={false} />
              <YAxis />
              <Tooltip content={<StepTooltip />} />
              <ReferenceLine y={10000} stroke={primary} strokeDasharray="3 3" label={{ position: 'right', value: 'Goal' }} />
              <Area type="monotone" dataKey="value" stroke={primary} fill={accent} fillOpacity={0.3} dot={false} />
              <Brush dataKey="timestamp" height={20} travellerWidth={10} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
