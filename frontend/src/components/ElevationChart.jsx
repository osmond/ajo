import React from "react";
import ChartCard from "./ChartCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  CartesianGrid,
} from "recharts";

function ElevationTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { dist, elevation } = payload[0].payload;
  return (
    <div className="rounded border border-border bg-background p-2 text-sm font-normal shadow">
      <div className="flex items-center gap-1">
        <span>⛰️</span>
        <span>{elevation.toFixed(0)} m</span>
      </div>
      <div className="text-xs text-muted-foreground">at {dist.toFixed(2)} km</div>
    </div>
  );
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ElevationChart({ points = [], activeIndex = null }) {
  if (!points.length) return null;
  const data = [];
  let dist = 0;
  for (let i = 0; i < points.length; i++) {
    if (i > 0) {
      dist += haversine(
        points[i - 1].lat,
        points[i - 1].lon,
        points[i].lat,
        points[i].lon
      );
    }
    data.push({
      dist: +(dist / 1000).toFixed(2),
      elevation: points[i].elevation ?? 0,
    });
  }

  return (
    <ChartCard title="Elevation Profile">
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#E5E7EB" strokeWidth={1} strokeDasharray="4 4" />
            <XAxis dataKey="dist" unit="km" />
            <YAxis dataKey="elevation" unit="m" />
            <Tooltip content={<ElevationTooltip />} />
            <Line type="monotone" dataKey="elevation" stroke="hsl(var(--primary))" dot={false} />
            {activeIndex !== null && data[activeIndex] && (
              <ReferenceDot
                x={data[activeIndex].dist}
                y={data[activeIndex].elevation}
                r={4}
                fill="hsl(var(--accent))"
                stroke="none"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
