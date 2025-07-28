import React from "react";
import ChartCard from "./ChartCard";
import ActivityCalendar from "./ActivityCalendar";
import { fetchActivityTrack } from "../api";
const LazyMap = React.lazy(() => import("./TrackMap"));

export default function MapSection() {
  const [points, setPoints] = React.useState([]);
  const [center, setCenter] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const loadTrack = React.useCallback((act) => {
    setError(null);
    setLoading(true);
    setCenter([act.lat, act.lon]);
    fetchActivityTrack(act.activityId)
      .then(setPoints)
      .catch(() => setError("Failed to load map"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ChartCard title="Activity Map">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="sm:w-1/4">
          <ActivityCalendar onSelect={loadTrack} />
        </div>
        <div className="h-64 flex-1 rounded-md bg-muted">
          {loading && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading...
            </div>
          )}
          {error && (
            <div className="flex h-full items-center justify-center text-sm text-red-500">
              {error}
            </div>
          )}
          {!loading && !error && points.length > 0 && (
            <React.Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Loading map...
                </div>
              }
            >
              <LazyMap points={points} center={center} />
            </React.Suspense>
          )}
        </div>
      </div>
    </ChartCard>
  );
}

