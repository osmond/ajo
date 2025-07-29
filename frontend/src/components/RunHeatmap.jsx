import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { fetchDailyTotals } from "../api";
import Skeleton from "./ui/Skeleton";

export default function RunHeatmap() {
  const [runs, setRuns] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchDailyTotals()
      .then(setRuns)
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton className="h-20 w-full" />;
  if (error) return <div className="text-sm text-destructive">{error}</div>;
  if (!runs.length)
    return <div className="text-sm text-muted-foreground">No data</div>;

  const values = runs.map((r) => ({
    date: r.date,
    count: r.distance / 1609.34,
  }));

  const palette = ["heatmap-scale-0", "heatmap-scale-1", "heatmap-scale-2", "heatmap-scale-3"];
  return (
    <CalendarHeatmap
      startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
      endDate={new Date()}
      values={values}
      titleForValue={(v) =>
        v && v.date ? `${v.date}: ${(v.count ?? 0).toFixed(1)} mi` : null
      }
      classForValue={(v) => {
        if (!v || v.count === null || v.count === undefined) {
          return "heatmap-empty";
        }
        const c = v.count;
        let idx = 0;
        if (c > 10) idx = 3;
        else if (c > 5) idx = 2;
        else if (c > 2) idx = 1;
        return palette[idx];
      }}
      tooltipDataAttrs={(v) => ({
        "data-tip": `${v.date}: ${(v.count ?? 0).toFixed(1)}\u00a0mi`,
      })}
    />
  );
}
