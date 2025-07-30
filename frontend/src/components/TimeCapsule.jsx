import React from "react";
import { fetchDailyTotals } from "../api";
import Skeleton from "./ui/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

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
            return (
              <div key={key} className="w-28">
                <button
                  onClick={() => toggle(key)}
                  className="w-full rounded-md bg-muted p-2 text-left shadow transition-transform hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <div className="font-medium">
                    {monthName} {y}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(total / 1000).toFixed(1)} km
                  </div>
                </button>
                {open === key && (
                  <div className="mt-1 space-y-1 rounded-md bg-muted/50 p-2 text-xs">
                    {months[key].map((d) => (
                      <div key={d.date} className="flex justify-between">
                        <span>{d.date.split("-")[2]}</span>
                        <span>{(d.distance / 1000).toFixed(1)} km</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
