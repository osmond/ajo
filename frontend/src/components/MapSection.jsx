import React from "react";
import ChartCard from "./ChartCard";
import { fetchActivityTrack } from "../api";
const LazyMap = React.lazy(() => import("./TrackMap"));

export default function MapSection() {
  const [points, setPoints] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchActivityTrack("act_1")
      .then(setPoints)
      .catch(() => setError("Failed to load map"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ChartCard title="Recent Route">
      <div className="h-64 rounded-md bg-muted">
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
        {!loading && !error && (
          <React.Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Loading map...
              </div>
            }
          >
            <LazyMap points={points} />
          </React.Suspense>
        )}
      </div>
    </ChartCard>
  );
}
