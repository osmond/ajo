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

  const keys = Object.keys(months).sort().reverse();

  function toggle(key) {
    setOpen((prev) => (prev === key ? null : key));
  }

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
        <div className="flex flex-wrap gap-2">
          {keys.map((key) => {
            const [y, m] = key.split("-");
            const monthName = new Date(`${key}-01`).toLocaleString("default", {
              month: "short",
            });
            const total = months[key].reduce((s, d) => s + d.distance, 0);
            const chartData = months[key].map((d) => ({
              day: d.date.split("-")[2],
              km: +(d.distance / 1000).toFixed(2),
            }));
            return (
              <Card key={key} className="w-32 cursor-pointer" onClick={() => toggle(key)}>
                <CardHeader className="p-2 pb-0">
                  <CardTitle className="text-lg font-semibold">
                    {monthName} {y}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-1">
                  <div className="mb-1 text-accent font-semibold">
                    {(total / 1000).toFixed(1)} km
                  </div>
                  <div className="h-8 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <Bar dataKey="km" fill="hsl(var(--accent))" radius={[2,2,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {open === key && (
                    <div className="mt-2 space-y-1 text-xs">
                      {months[key].map((d) => (
                        <div key={d.date} className="flex justify-between">
                          <span>{d.date.split("-")[2]}</span>
                          <span>{(d.distance / 1000).toFixed(1)} km</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
