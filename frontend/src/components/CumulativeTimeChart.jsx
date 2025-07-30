import React from "react";
import ChartCard from "./ChartCard";
import Skeleton from "./ui/Skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchDailyTotals } from "../api";

export function aggregateTimeByMonth(daily) {
  const totals = {};
  for (const { date, duration } of daily) {
    const m = date.slice(0, 7);
    totals[m] = (totals[m] || 0) + duration;
  }
  const months = Object.keys(totals).sort();
  const monthlyTotals = months.map((m) => totals[m]);
  const cumulative = [];
  let sum = 0;
  for (const val of monthlyTotals) {
    sum += val;
    cumulative.push(sum);
  }
  return { months, monthlyTotals, cumulative };
}

export default function CumulativeTimeChart() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchDailyTotals()
      .then((rows) => {
        const { months, cumulative } = aggregateTimeByMonth(rows);
        const chart = months.map((m, i) => ({
          month: m,
          cumulative: +(cumulative[i] / 3600).toFixed(2),
        }));
        setData(chart);
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const Dot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="hsl(var(--primary))"
        title={`${payload.month}: ${payload.cumulative.toFixed(1)} h`}
      />
    );
  };

  return (
    <ChartCard title="Time Spent Running">
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
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid
                stroke="hsl(var(--border))"
                strokeWidth={1}
                horizontal={false}
              />
              <XAxis dataKey="month" />
              <YAxis unit="h" />
              <Tooltip formatter={(v) => `${v.toFixed(1)} h`} />
              <Line type="monotone" dataKey="cumulative" stroke="hsl(var(--primary))" dot={<Dot />} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
