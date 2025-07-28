import React from "react";
import { fetchActivitiesByDate } from "../api";

export default function ActivityCalendar({ onSelect }) {
  const [days, setDays] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchActivitiesByDate()
      .then((data) => {
        const list = Object.keys(data)
          .sort()
          .map((date) => ({ date, activities: data[date] }));
        setDays(list);
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }
  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  return (
    <ul className="space-y-2">
      {days.map((d) => (
        <li key={d.date}>
          <button
            onClick={() => onSelect(d.activities[0])}
            className="w-full rounded-md bg-muted px-2 py-1 text-left hover:bg-muted/70"
          >
            {d.date}
          </button>
        </li>
      ))}
    </ul>
  );
}

