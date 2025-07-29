import React from "react";
import ChartCard from "./ChartCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { fetchHeartrate } from "../api";
import Skeleton from "./ui/Skeleton";

function ZoneTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { zone, value } = payload[0].payload;
  return (
    <div className="rounded bg-background p-2 text-sm font-normal shadow">
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
  // Using colored bars for each zone

  React.useEffect(() => {
    fetchHeartrate()
      .then((data) => {
        const zoneDefs = [
          { label: "Easy", min: 0, max: 99, shade: 0.25 },
          { label: "Fat Burn", min: 100, max: 119, shade: 0.5 },
          { label: "Cardio", min: 120, max: 139, shade: 0.75 },
          { label: "Peak", min: 140, max: Infinity, shade: 1 },
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
          zoneDefs.map((z, i) => ({
            zone: z.label,
            value: counts[i],
            color: `hsl(var(--accent) / ${z.shade})`,
          }))
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
          <div className="flex h-full items-center justify-center text-sm font-normal text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zones} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="zone" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<ZoneTooltip />} />
              <Bar dataKey="value">
                {zones.map((z, idx) => (
                  <Cell key={idx} fill={z.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
