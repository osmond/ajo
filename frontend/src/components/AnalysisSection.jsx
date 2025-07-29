import React from "react";
import ChartCard from "./ChartCard";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchAnalysis } from "../api";
import Skeleton from "./ui/Skeleton";
import TimeOfDay from "./TimeOfDay";

function AnalysisTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { temperature, avgPace } = payload[0].payload;
  return (
    <div className="rounded border border-border bg-background p-2 text-sm font-normal shadow">
      <div className="flex items-center gap-1">
        <span>🌡️</span>
        <span>{temperature}°C</span>
      </div>
      <div className="flex items-center gap-1">
        <span>⏱</span>
        <span>{avgPace} min/km</span>
      </div>
    </div>
  );
}

export default function AnalysisSection() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchAnalysis()
      .then(setData)
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <ChartCard title="Pace vs Temperature">
        <div className="h-64">
          {loading && <Skeleton className="h-full w-full" />}
          {error && (
            <div className="flex h-full items-center justify-center text-sm font-normal text-destructive">{error}</div>
          )}
          {!loading && !error && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid stroke="#E5E7EB" strokeWidth={1} />
                <XAxis dataKey="temperature" name="Temp" unit="°C" />
                <YAxis dataKey="avgPace" name="Pace" unit="min/km" />
                <Tooltip content={<AnalysisTooltip />} />
                <Scatter data={data} fill="hsl(var(--primary))" />
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>
      <TimeOfDay />
    </div>
  );
}
