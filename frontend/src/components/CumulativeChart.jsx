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

export function aggregateByMonth(daily) {
  const totals = {};
  for (const { date, distance } of daily) {
    const m = date.slice(0, 7);
    totals[m] = (totals[m] || 0) + distance;
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

export default function CumulativeChart() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchDailyTotals()
      .then((rows) => {
        const { months, cumulative } = aggregateByMonth(rows);
        const chart = months.map((m, i) => ({
          month: m,
          cumulative: +(cumulative[i] / 1000).toFixed(2),
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
        title={`${payload.month}: ${payload.cumulative.toFixed(1)} km`}
      />
    );
  };

  return (
    <ChartCard title="Mileage Over Time">
      <div className="h-64">
        {loading && <Skeleton className="h-full w-full" />}
        {error && (
          <div className="flex h-full items-center justify-center text-sm text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && data.length === 0 && (
          <div className="text-sm text-muted-foreground">No data</div>
        )}
        {!loading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="hsl(var(--muted))" strokeDasharray="3 3" horizontal={false} />
              <XAxis dataKey="month" />
              <YAxis unit="km" />
              <Tooltip formatter={(v) => `${v.toFixed(1)} km`} />
              <Line type="monotone" dataKey="cumulative" stroke="hsl(var(--primary))" dot={<Dot />} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
