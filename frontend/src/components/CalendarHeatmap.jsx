import React from "react";
import { fetchDailyTotals } from "../api";
import Skeleton from "./ui/Skeleton";
import Tooltip from "./ui/tooltip";

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
    return <div className="text-sm font-normal text-destructive">{error}</div>;
  }
  if (!data.length) {
    return <div className="text-sm font-normal text-muted-foreground">No data</div>;
  }

  const max = Math.max(...data.map((d) => d.distance));

  return (
    <div className="grid grid-cols-7 gap-1 text-xs">
      {data.map((d) => {
        const intensity = d.distance / max;
        let idx = 0;
        if (intensity > 0.75) idx = 3;
        else if (intensity > 0.5) idx = 2;
        else if (intensity > 0.25) idx = 1;
        const title = `${d.date} - ${(d.distance / 1000).toFixed(1)} km, ${(d.duration / 60).toFixed(0)} min`;
        return (
          <Tooltip key={d.date} text={title}>
            <div
              className={`h-4 w-4 rounded transition-transform hover:scale-110 focus:scale-110 heatmap-scale-${idx}`}
              aria-label={title}
              data-testid="heatmap-square"
            />
          </Tooltip>
        );
      })}
    </div>
  );
}
