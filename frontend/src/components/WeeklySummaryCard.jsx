import React from "react";
import { Card, CardHeader, CardContent } from "./ui/Card";
import Skeleton from "./ui/Skeleton";
import { fetchDailyTotals, fetchSteps, fetchSleep } from "../api";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { Download, Share2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import ProgressRing from "./ui/ProgressRing";

const STEP_GOAL = 10000;
const DISTANCE_GOAL_KM = 20;

export function computeStats(currSteps = [], prevSteps = [], currSleep = [], prevSleep = [], currTotals = [], prevTotals = []) {
  const sum = (arr, key) => arr.reduce((s, p) => s + (p[key] || 0), 0);

  const totalSteps = sum(currSteps, "value");
  const prevStepsTotal = sum(prevSteps, "value");
  const totalSleep = sum(currSleep, "value");
  const prevSleepTotal = sum(prevSleep, "value");
  const totalDistance = sum(currTotals, "distance");
  const prevDistance = sum(prevTotals, "distance");

  const pct = (cur, prev) =>
    prev ? ((cur - prev) / prev) * 100 : null;

  return {
    totalSteps,
    totalSleep,
    totalDistanceKm: totalDistance / 1000,
    stepsPct: pct(totalSteps, prevStepsTotal),
    sleepPct: pct(totalSleep, prevSleepTotal),
    distancePct: pct(totalDistance, prevDistance),
  };
}

export default function WeeklySummaryCard({ children }) {
  const [steps, setSteps] = React.useState([]);
  const [sleep, setSleep] = React.useState([]);
  const [totals, setTotals] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [range, setRange] = React.useState("7");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const todayDistanceKm =
    (totals[totals.length - 1]?.distance ?? 0) / 1000;

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

  let filteredSteps = steps;
  let filteredSleep = sleep;
  let filteredTotals = totals;

  if (range === "7" || range === "30") {
    const days = parseInt(range, 10);
    filteredSteps = steps.slice(-days);
    filteredSleep = sleep.slice(-days);
    filteredTotals = totals.slice(-days);
  } else if (range === "month") {
    const now = new Date();
    const m = now.getMonth();
    const y = now.getFullYear();
    const inMonth = (d) => d.getMonth() === m && d.getFullYear() === y;
    filteredSteps = steps.filter((p) => inMonth(new Date(p.timestamp)));
    filteredSleep = sleep.filter((p) => inMonth(new Date(p.timestamp)));
    filteredTotals = totals.filter((p) => inMonth(new Date(p.date)));
  } else if (range === "custom" && startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    filteredSteps = steps.filter((p) => {
      const d = new Date(p.timestamp);
      return d >= start && d <= end;
    });
    filteredSleep = sleep.filter((p) => {
      const d = new Date(p.timestamp);
      return d >= start && d <= end;
    });
    filteredTotals = totals.filter((p) => {
      const d = new Date(p.date);
      return d >= start && d <= end;
    });
  }
  const len = filteredSteps.length || 1;
  const startIndex = steps.length - len;
  const prevSteps = steps.slice(Math.max(0, startIndex - len), startIndex);
  const prevSleep = sleep.slice(Math.max(0, startIndex - len), startIndex);
  const prevTotals = totals.slice(Math.max(0, startIndex - len), startIndex);

  const {
    totalSteps,
    totalSleep,
    totalDistanceKm,
    stepsPct,
    sleepPct,
    distancePct,
  } = computeStats(
    filteredSteps,
    prevSteps,
    filteredSleep,
    prevSleep,
    filteredTotals,
    prevTotals
  );

  let comparisonLabel = 'vs last week';
  if (range === 'month') {
    comparisonLabel = 'vs last month';
  } else if (range === '30') {
    comparisonLabel = 'vs last 30 days';
  } else if (range === '7') {
    comparisonLabel = 'vs last week';
  } else if (range === 'custom' && startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
    comparisonLabel = `vs previous ${days} days`;
  } else if (range === 'all') {
    comparisonLabel = 'vs previous period';
  } else {
    const num = parseInt(range, 10);
    if (!isNaN(num)) {
      comparisonLabel = `vs last ${num} days`;
    }
  }

  function quick(days) {
    setRange(days);
    setStartDate("");
    setEndDate("");
  }

  function handleExport() {
    const rows = filteredTotals.map((t) => `${t.date},${t.distance},${t.duration}`).join("\n");
    const csv = `date,distance,duration\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href);
  }

  return (
    <Card className="mb-4 animate-in fade-in">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded-md p-1 text-sm"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="month">This month</option>
            <option value="custom">Custom range</option>
          </select>
          {range === "custom" && (
            <>
              <input
                type="date"
                className="rounded-md p-1 text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="rounded-md p-1 text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm" onClick={() => quick("7")}>7 days</button>
          <button className="text-sm" onClick={() => quick("30")}>30 days</button>
          <button className="text-sm" onClick={() => quick("all")}>All time</button>
          <button onClick={handleExport} className="p-1"><Download className="h-4 w-4" /></button>
          <button onClick={handleShare} className="p-1"><Share2 className="h-4 w-4" /></button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm font-normal text-muted-foreground">
          {loading && <Skeleton className="h-6 w-32" />}
          {error && !loading && <div className="text-destructive">{error}</div>}
          {!loading && !error && (
            <>
              <span className="mr-1">
                {totalDistanceKm.toFixed(1)} km
                <span className="ml-1 inline-flex items-center">
                  {distancePct === null ? null : distancePct >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-destructive" />
                  )}
                  <span className="ml-0.5">
                    {distancePct === null
                      ? 'N/A'
                      : `${Math.abs(distancePct).toFixed(0)}%`}
                  </span>
                </span>
              </span>
              &bull;
              <span className="mx-1">
                {totalSteps} steps
                <span className="ml-1 inline-flex items-center">
                  {stepsPct === null ? null : stepsPct >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-destructive" />
                  )}
                  <span className="ml-0.5">
                    {stepsPct === null
                      ? 'N/A'
                      : `${Math.abs(stepsPct).toFixed(0)}%`}
                  </span>
                </span>
              </span>
              &bull;
              <span className="ml-1">
                {totalSleep.toFixed(1)}h sleep
                <span className="ml-1 inline-flex items-center">
                  {sleepPct === null ? null : sleepPct >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-destructive" />
                  )}
                  <span className="ml-0.5">
                    {sleepPct === null
                      ? 'N/A'
                      : `${Math.abs(sleepPct).toFixed(0)}%`}
                  </span>
                </span>
              </span>
              <div className="text-xs">{comparisonLabel}</div>
            </>
          )}
        </div>
        {!loading && !error && (
          <div className="flex items-end gap-4">
            <ProgressRing
              value={todayDistanceKm}
              max={DISTANCE_GOAL_KM}
              unit="km"
              title="Distance today"
              size={60}
            />
            <div className="h-8 w-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredSteps} margin={{ top: 2, bottom: 2 }}>
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="none" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="h-8 w-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredSleep} margin={{ top: 2, bottom: 2 }}>
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="none" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
