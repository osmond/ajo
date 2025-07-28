import React from "react";
import ChartCard from "./ChartCard";
import ActivityCalendar from "./ActivityCalendar";
import { fetchActivityTrack, fetchRoutes } from "../api";
const LazyMap = React.lazy(() => import("./LeafletMap"));
const LazyHeatmap = React.lazy(() => import("./RouteHeatmap"));

export default function MapSection() {
  const [points, setPoints] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [routes, setRoutes] = React.useState([]);
  const [loadingRoutes, setLoadingRoutes] = React.useState(true);
  const [errorRoutes, setErrorRoutes] = React.useState(null);
  const [activityType, setActivityType] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [metric, setMetric] = React.useState("heartRate");

  const loadTrack = React.useCallback((act) => {
    setError(null);
    setLoading(true);
    fetchActivityTrack(act.activityId)
      .then(setPoints)
      .catch(() => setError("Failed to load map"))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    setLoadingRoutes(true);
    setErrorRoutes(null);
    fetchRoutes({ activityType, startDate, endDate })
      .then(setRoutes)
      .catch(() => setErrorRoutes("Failed to load routes"))
      .finally(() => setLoadingRoutes(false));
  }, [activityType, startDate, endDate]);

  return (
    <div className="space-y-6">
      <ChartCard title="Activity Map">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="sm:w-1/4 flex flex-col gap-2">
            <ActivityCalendar onSelect={loadTrack} />
            <select
              className="rounded-md border p-1 text-sm"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
            >
              <option value="heartRate">Heart Rate</option>
              <option value="speed">Speed</option>
            </select>
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
                <LazyMap points={points} metricKey={metric} />
              </React.Suspense>
            )}
          </div>
        </div>
      </ChartCard>
      <ChartCard title="Route Heatmap">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row">
          <select
            className="rounded-md border p-1 text-sm"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="run">Run</option>
            <option value="bike">Bike</option>
          </select>
          <input
            type="date"
            className="rounded-md border p-1 text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="rounded-md border p-1 text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="h-64 rounded-md bg-muted">
          {loadingRoutes && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading...
            </div>
          )}
          {errorRoutes && (
            <div className="flex h-full items-center justify-center text-sm text-red-500">
              {errorRoutes}
            </div>
          )}
          {!loadingRoutes && !errorRoutes && routes.length > 0 && (
            <React.Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Loading map...
                </div>
              }
            >
              <LazyHeatmap coords={routes} />
            </React.Suspense>
          )}
        </div>
      </ChartCard>
    </div>
  );
}

