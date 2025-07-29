import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import Skeleton from "./ui/Skeleton";
import { fetchRuns } from "../api";
import { parseISO, differenceInCalendarDays } from "date-fns";

export function computeSummary(runs = []) {
  if (!runs.length)
    return { runCount: 0, totalDistance: 0, totalDuration: 0, streak: 0 };

  const runDates = Array.from(new Set(runs.map((r) => r.date))).sort((a, b) =>
    b.localeCompare(a)
  );

  let streak = 1;
  for (let i = 1; i < runDates.length; i++) {
    const prev = parseISO(runDates[i - 1]);
    const cur = parseISO(runDates[i]);
    if (differenceInCalendarDays(prev, cur) === 1) streak++;
    else break;
  }

  const totals = runs.reduce(
    (acc, r) => {
      acc.totalDistance += r.distance || 0;
      acc.totalDuration += r.duration || 0;
      return acc;
    },
    { totalDistance: 0, totalDuration: 0 }
  );

  return { runCount: runs.length, streak, ...totals };
}

export default function SummaryCard({ children }) {
  const [summary, setSummary] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchRuns()
      .then((data) => setSummary(computeSummary(data)))
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="animate-in fade-in">
      <CardHeader>
        {loading && <Skeleton className="h-6 w-32" />}
        {error && !loading && (
          <div className="text-sm font-normal text-destructive">{error}</div>
        )}
        {!loading && !error && summary && (
          <>
            <CardTitle>Run Summary</CardTitle>
            <div className="text-sm font-normal text-muted-foreground">
              {summary.runCount} runs &bull;{" "}
              {(summary.totalDistance / 1000).toFixed(1)} km &bull;{" "}
              {summary.streak} day streak
            </div>
          </>
        )}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}
