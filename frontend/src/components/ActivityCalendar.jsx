import React from "react";
import { fetchActivitiesByDate } from "../api";

export default function ActivityCalendar({ onSelect }) {
  const [days, setDays] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchActivitiesByDate()
      .then((data) => setDays(data))
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }
  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  const activityDates = Object.keys(days).sort();
  const first = activityDates.length
    ? new Date(activityDates[0])
    : new Date();
  const year = first.getFullYear();
  const month = first.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(
      2,
      "0"
    )}`;
    cells.push(ds);
  }

  return (
    <div className="grid grid-cols-7 gap-1 text-sm">
      {cells.map((date, idx) => {
        if (!date) return <div key={"empty-" + idx}></div>;
        const acts = days[date];
        const dayNum = date.split("-")[2].replace(/^0/, "");
        if (acts) {
          return (
            <button
              key={date}
              onClick={() => onSelect(acts[0])}
              className="rounded-md bg-muted px-2 py-1 hover:bg-muted/70"
            >
              {dayNum}
            </button>
          );
        }
        return (
          <div key={date} className="text-muted-foreground px-2 py-1 text-center">
            {dayNum}
          </div>
        );
      })}
    </div>
  );
}

