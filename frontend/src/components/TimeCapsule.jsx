import React from "react";
import { fetchDailyTotals } from "../api";
import Skeleton from "./ui/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { ResponsiveContainer, BarChart, Bar } from "recharts";

export default function TimeCapsule() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [open, setOpen] = React.useState(null); // YYYY-MM

  React.useEffect(() => {
    fetchDailyTotals()
      .then(setData)
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const months = React.useMemo(() => {
    const groups = {};
    data.forEach((d) => {
      const [y, m] = d.date.split("-");
      const key = `${y}-${m}`;
      groups[key] = groups[key] || [];
      groups[key].push(d);
    });
    return groups;
  }, [data]);

  const keys = Object.keys(months).sort();

  // Open the newest month once data has loaded
  React.useEffect(() => {
    if (open === null && keys.length) {
      setOpen(keys[keys.length - 1]);
    }
  }, [keys, open]);

  function toggle(key) {
    setOpen((prev) => (prev === key ? null : key));
  }

  const openData = React.useMemo(() => {
    if (!open || !months[open]) return null;
    const [y, m] = open.split("-");
    const monthName = new Date(`${open}-01`).toLocaleString("default", {
      month: "long",
    });
    const entries = months[open];
    const total = entries.reduce((s, d) => s + d.distance, 0);
    const chartData = entries.map((d) => ({
      day: d.date.split("-")[2],
      km: +(d.distance / 1000).toFixed(2),
    }));
    return { y, monthName, total, chartData, entries };
  }, [open, months]);

  if (loading) return <Skeleton className="h-32 w-full" />;
  if (error)
    return <div className="text-sm font-normal text-destructive">{error}</div>;
  if (!keys.length)
    return <div className="text-sm font-normal text-muted-foreground">No data</div>;

  return (
    <Card className="animate-in fade-in">
      <CardHeader>
        <CardTitle>Time Capsule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="relative flex items-end gap-6 py-4 pl-4">
            <div className="absolute top-1/2 left-4 right-4 h-px bg-border" />
            {keys.map((key) => {
              const monthName = new Date(`${key}-01`).toLocaleString("default", {
                month: "short",
              });
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className="relative z-10 flex flex-col items-center text-xs whitespace-nowrap focus:outline-none"
                >
                  <span
                    className={`h-3 w-3 rounded-full border ${
                      open === key ? "bg-accent border-accent" : "bg-background"
                    }`}
                  />
                  <span className="mt-1">{monthName}</span>
                </button>
              );
            })}
          </div>
        </div>
        {openData && (
          <div className="mt-4">
            <div className="mb-2 text-sm font-semibold">
              {openData.monthName} {openData.y} - {(openData.total / 1000).toFixed(1)} km
            </div>
            <div className="h-16 mb-2 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={openData.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Bar dataKey="km" fill="hsl(var(--accent))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 text-xs">
              {openData.entries.map((d) => (
                <div key={d.date} className="flex justify-between">
                  <span>{d.date.split("-")[2]}</span>
                  <span>{(d.distance / 1000).toFixed(1)} km</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
