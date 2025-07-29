import React from "react";
import { Card, CardHeader, CardContent } from "./ui/Card";
import Skeleton from "./ui/Skeleton";
import { fetchDailyTotals, fetchSteps, fetchSleep } from "../api";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { Download, Share2 } from "lucide-react";

export default function WeeklySummaryCard({ children }) {
  const [steps, setSteps] = React.useState([]);
  const [sleep, setSleep] = React.useState([]);
  const [totals, setTotals] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [range, setRange] = React.useState("7");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

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

  const totalSteps = filteredSteps.reduce((sum, p) => sum + p.value, 0);
  const totalSleep = filteredSleep.reduce((sum, p) => sum + p.value, 0);
  const totalDistanceKm =
    filteredTotals.reduce((sum, p) => sum + p.distance, 0) / 1000;

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
              {totalDistanceKm.toFixed(1)} km &bull; {totalSteps} steps &bull; {" "}
              {totalSleep.toFixed(1)}h sleep
            </>
          )}
        </div>
        {!loading && !error && (
          <div className="flex items-end gap-4">
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
