import React from "react";
import ChartCard from "./ChartCard";
import Skeleton from "./ui/Skeleton";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { fetchAnalysis } from "../api";

export default function WeatherImpactBubbleChart() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchAnalysis()
      .then((rows) => {
        const pts = rows.map((r) => ({
          temperature: r.temperature,
          avgHeartRate: r.avgHeartRate,
          distanceKm: +(r.distance / 1000).toFixed(2),
        }));
        setData(pts);
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const renderTooltip = (val, name) => {
    if (name === "distanceKm") return [`${val.toFixed(1)} km`, "Distance"];
    if (name === "temperature") return [`${val}°C`, "Temperature"];
    if (name === "avgHeartRate") return [`${val} bpm`, "Heart Rate"];
    return [val, name];
  };

  return (
    <ChartCard title="Weather Impact">
      <div className="h-64">
        {loading && <Skeleton className="h-full w-full" />}
        {error && (
          <div className="flex h-full items-center justify-center text-sm font-normal text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && data.length === 0 && (
          <div className="text-sm font-normal text-muted-foreground">No data</div>
        )}
        {!loading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid stroke="#E5E7EB" />
              <XAxis type="number" dataKey="temperature" unit="°C" />
              <YAxis type="number" dataKey="avgHeartRate" unit="bpm" />
              <ZAxis type="number" dataKey="distanceKm" range={[30, 200]} />
              <Tooltip formatter={renderTooltip} />
              <Scatter data={data} fill="hsl(var(--primary))" />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
