import React from "react";
import { fetchDailyTotals } from "../api";
import Skeleton from "./ui/Skeleton";

export default function DailyHeatmap() {
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
        let color = "bg-green-200";
        if (intensity > 0.66) color = "bg-green-600";
        else if (intensity > 0.33) color = "bg-green-400";
        return (
          <div
            key={d.date}
            className={`h-4 w-4 rounded ${color} transition-transform hover:scale-110 focus:scale-110`}
            title={`${d.date} - ${(d.distance / 1000).toFixed(1)} km`}
          />
        );
      })}
    </div>
  );
}
