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
import { fetchSteps } from "../api";

export default function StepsSparkline() {
  const [steps, setSteps] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const gradientId = React.useId();

  React.useEffect(() => {
    fetchSteps()
      .then(setSteps)
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ChartCard title="Step Trend">
      <div className="h-40">
        {loading && (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading...
          </div>
        )}
        {error && (
          <div className="flex h-full items-center justify-center text-sm text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={steps} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tick={false} />
              <YAxis />
              <Tooltip />
              <ReferenceLine y={10000} stroke="hsl(var(--primary))" strokeDasharray="3 3" label={{ position: 'right', value: 'Goal' }} />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill={`url(#${gradientId})`} dot={false} />
              <Brush dataKey="timestamp" height={20} travellerWidth={10} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
