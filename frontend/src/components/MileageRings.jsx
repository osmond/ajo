import React from "react";
import { parseISO, startOfWeek, format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import ProgressRing from "./ui/ProgressRing";
import Skeleton from "./ui/Skeleton";
import { fetchDailyTotals } from "../api";
import { Check } from "lucide-react";

const DEFAULT_GOAL_KM = 40;

function groupByWeek(totals) {
  const weeks = {};
  for (const { date, distance } of totals) {
    const weekStart = format(
      startOfWeek(parseISO(date), { weekStartsOn: 1 }),
      "yyyy-MM-dd"
    );
    weeks[weekStart] = (weeks[weekStart] || 0) + distance;
  }
  return Object.entries(weeks)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([weekStart, dist]) => ({ weekStart, distanceKm: dist / 1000 }));
}

export default function MileageRings({ goalKm = DEFAULT_GOAL_KM, weeksToShow = 4 }) {
  const [weeks, setWeeks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchDailyTotals()
      .then((rows) => {
        const grouped = groupByWeek(rows).slice(-weeksToShow);
        setWeeks(grouped);
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, [weeksToShow]);

  return (
    <Card className="animate-in fade-in">
      <CardHeader>
        <CardTitle>Mileage Rings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-center gap-4">
        {loading && <Skeleton className="h-20 w-20 rounded-full" />}
        {error && !loading && (
          <div className="text-sm text-destructive">{error}</div>
        )}
        {!loading && !error &&
          weeks.map(({ weekStart, distanceKm }) => (
            <div key={weekStart} className="flex flex-col items-center">
              <div className="relative">
                <ProgressRing
                  value={Math.round(distanceKm)}
                  max={goalKm}
                  unit="km"
                  size={80}
                  title={`Week of ${weekStart}`}
                />
                {distanceKm >= goalKm && (
                  <Check className="absolute inset-0 m-auto h-6 w-6 text-emerald-600 z-10 animate-in fade-in pointer-events-none" />
                )}
              </div>
              <span className="mt-1 text-xs text-muted-foreground">
                {format(parseISO(weekStart), "MMM d")}
              </span>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
