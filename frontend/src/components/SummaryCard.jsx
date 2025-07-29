import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import Skeleton from "./ui/Skeleton";
import TrackMap from "./TrackMap";
import {
  fetchRuns,
  fetchActivities,
  fetchActivityTrack,
} from "../api";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
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
  const [runs, setRuns] = React.useState([]);
  const [track, setTrack] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    Promise.all([
      fetchRuns(),
      fetchActivities({ type: "run", limit: 1 }).then((acts) =>
        acts.length ? fetchActivityTrack(acts[0].activityId) : []
      ),
    ])
      .then(([runData, trackData]) => {
        setRuns(runData);
        setSummary(computeSummary(runData));
        setTrack(trackData);
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const distanceData = runs.map((r) => ({
    date: r.date,
    km: (r.distance || 0) / 1000,
  }));

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
      <CardContent>
        {loading && <Skeleton className="h-24 w-full" />}
        {!loading && !error && (
          <div className="flex flex-col gap-4 sm:flex-row">
            {track.length > 0 && (
              <div className="h-32 flex-1">
                <TrackMap points={track} />
              </div>
            )}
            {distanceData.length > 0 && (
              <div className="h-32 sm:w-1/3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={distanceData} margin={{ top: 2, bottom: 2 }}>
                    <Line
                      type="monotone"
                      dataKey="km"
                      stroke="hsl(var(--primary))"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
