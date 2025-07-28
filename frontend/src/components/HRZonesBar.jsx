import React from "react";
import ChartCard from "./ChartCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchHeartrate } from "../api";
import Skeleton from "./ui/Skeleton";

function ZoneTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { zone, value } = payload[0].payload;
  return (
    <div className="rounded bg-background p-2 text-sm shadow">
      <div>{zone}</div>
      <div className="flex items-center gap-1">
        <span>❤️</span>
        <span>{value} samples</span>
      </div>
    </div>
  );
}

export default function HRZonesBar() {
  const [zones, setZones] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const gradientId = React.useId();

  React.useEffect(() => {
    fetchHeartrate()
      .then((data) => {
        const zoneDefs = [
          { label: "Easy", min: 0, max: 99 },
          { label: "Fat Burn", min: 100, max: 119 },
          { label: "Cardio", min: 120, max: 139 },
          { label: "Peak", min: 140, max: Infinity },
        ];
        const counts = zoneDefs.map(() => 0);
        for (const p of data) {
          for (let i = 0; i < zoneDefs.length; i++) {
            if (p.value >= zoneDefs[i].min && p.value <= zoneDefs[i].max) {
              counts[i] += 1;
              break;
            }
          }
        }
        setZones(
          zoneDefs.map((z, i) => ({ zone: z.label, value: counts[i] }))
        );
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ChartCard title="HR Zones">
      <div className="h-40">
        {loading && <Skeleton className="h-full w-full" />}
        {error && (
          <div className="flex h-full items-center justify-center text-sm text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zones} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--destructive))" />
                </linearGradient>
              </defs>
              <XAxis dataKey="zone" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<ZoneTooltip />} />
              <Bar dataKey="value" fill={`url(#${gradientId})`} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
