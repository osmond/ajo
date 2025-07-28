import React from "react";
import { fetchDailyTotals } from "../api";
import Skeleton from "./ui/Skeleton";

export default function CalendarHeatmap() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchDailyTotals()
      .then(setData)
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Skeleton className="h-20 w-full" />;
  }
  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }
  if (!data.length) {
    return <div className="text-sm text-muted-foreground">No data</div>;
  }

  const max = Math.max(...data.map((d) => d.distance));

  return (
    <div className="grid grid-cols-7 gap-1 text-xs">
      {data.map((d) => {
        const intensity = d.distance / max;
        let color = "bg-tone-light";
        if (intensity > 0.66) color = "bg-tone-dark";
        else if (intensity > 0.33) color = "bg-tone-dark/60";
        const title = `${d.date} - ${(d.distance / 1000).toFixed(1)} km, ${(
          d.duration / 60
        ).toFixed(0)} min`;
        return (
          <div
            key={d.date}
            className={`h-4 w-4 rounded ${color} transition-transform hover:scale-110 focus:scale-110`}
            title={title}
          />
        );
      })}
    </div>
  );
}
