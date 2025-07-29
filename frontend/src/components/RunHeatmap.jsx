import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { fetchDailyTotals } from "../api";
import Skeleton from "./ui/Skeleton";

export default function RunHeatmap() {
  const [runs, setRuns] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const heatmapRef = React.useRef(null);

  React.useEffect(() => {
    fetchDailyTotals()
      .then(setRuns)
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    if (!heatmapRef.current) return;
    const container = heatmapRef.current;
    const start = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const end = new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Build list of months within the range
    let d = new Date(start.getFullYear(), start.getMonth(), 1);
    if (d < start) d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const months = [];
    while (d <= end) {
      months.push(new Date(d));
      d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    }

    const labels = container.querySelectorAll(
      '.react-calendar-heatmap-month-label'
    );
    labels.forEach((lbl, idx) => {
      const m = months[idx];
      if (!m) return;
      const dateStr = m.toISOString().split('T')[0];
      const rect = container.querySelector(`rect[data-tip^="${dateStr}"]`);
      if (rect) {
        const x = rect.getAttribute('x');
        if (x) lbl.setAttribute('x', x);
      }
    });
  }, [runs]);

  if (loading) return <Skeleton className="h-20 w-full" />;
  if (error) return <div className="text-sm text-destructive">{error}</div>;
  if (!runs.length)
    return <div className="text-sm text-muted-foreground">No data</div>;

  const values = runs.map((r) => ({
    date: r.date,
    count: r.distance / 1609.34,
  }));

  const palette = [
    "heatmap-scale-0",
    "heatmap-scale-1",
    "heatmap-scale-2",
    "heatmap-scale-3",
  ];

  return (
    <div ref={heatmapRef}>
      <CalendarHeatmap
        startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
        endDate={new Date()}
        values={values}
        gutterSize={2}
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
    </div>

  );
}
