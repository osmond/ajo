import React from "react";
import { Card, CardHeader } from "./ui/Card";
import Skeleton from "./ui/Skeleton";
import { fetchDailyTotals, fetchSteps, fetchSleep } from "../api";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function WeeklySummaryCard({ children }) {
  const [steps, setSteps] = React.useState([]);
  const [sleep, setSleep] = React.useState([]);
  const [totals, setTotals] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    Promise.all([fetchSteps(), fetchSleep(), fetchDailyTotals()])
      .then(([s, sl, dt]) => {
        setSteps(s);
        setSleep(sl);
        setTotals(dt);
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  // Only consider the last 7 days for the weekly summary
  const stepsLast7 = steps.slice(-7);
  const sleepLast7 = sleep.slice(-7);
  const totalsLast7 = totals.slice(-7);

  const totalSteps = stepsLast7.reduce((sum, p) => sum + p.value, 0);
  const totalSleep = sleepLast7.reduce((sum, p) => sum + p.value, 0);
  const totalDistanceKm =
    totalsLast7.reduce((sum, p) => sum + p.distance, 0) / 1000;

  return (
    <Card className="mb-4 animate-in fade-in">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          {loading && <Skeleton className="h-6 w-32" />}
          {error && !loading && (
            <div className="text-sm font-normal text-destructive">{error}</div>
          )}
          {!loading && !error && (
            <>
              <div className="text-2xl font-semibold">Weekly Totals</div>
              <div className="text-sm font-normal text-muted-foreground">
                {totalDistanceKm.toFixed(1)} km &bull; {totalSteps} steps &bull;{' '}
                {totalSleep.toFixed(1)}h sleep
              </div>
            </>
          )}
        </div>
        <div className="flex items-end gap-4">
          {loading && (
            <>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </>
          )}
          {!loading && !error && (
            <>
              <div className="h-8 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stepsLast7} margin={{ top: 2, bottom: 2 }}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="none"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-8 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sleepLast7} margin={{ top: 2, bottom: 2 }}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="none"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
          {children}
        </div>
      </CardHeader>
    </Card>
  );
}
