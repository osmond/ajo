import React from "react";
import ChartCard from "./ChartCard";
import { Card, CardContent } from "./ui/Card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import {

  fetchActivityTrack,
  fetchActivitiesByDate,
} from "../api";
import ElevationChart from "./ElevationChart";
const LazyMap = React.lazy(() => import("./LeafletMap"));
const LazyRoute3D = React.lazy(() => import("./Route3D"));

export default function MapSection() {
  const [points, setPoints] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [metric, setMetric] = React.useState("heartRate");
  const [showWeather, setShowWeather] = React.useState(false);
  const [hoverIdx, setHoverIdx] = React.useState(null);

  const loadTrack = React.useCallback((act) => {
    setError(null);
    setLoading(true);
    fetchActivityTrack(act.activityId)
      .then((pts) => {
        setPoints(pts);
        setHoverIdx(null);
      })
      .catch(() => setError("Failed to load map"))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    fetchActivitiesByDate()
      .then((data) => {
        const dates = Object.keys(data).sort();
        const latest = dates[dates.length - 1];
        if (latest && data[latest]?.length) {
          loadTrack(data[latest][0]);
        }
      })
      .catch(() => {
        /* ignore initial load errors */
      });
  }, [loadTrack]);



  return (
    <div className="space-y-6">
      <div className="h-64">
        <React.Suspense
          fallback={
            <div className="h-64 flex items-center justify-center text-sm font-normal text-muted-foreground">
              Loading map...
            </div>
          }
        >
          <LazyMap
            points={points}
            metricKey={metric}
            showWeather={showWeather}
            onHoverPoint={setHoverIdx}
          />
        </React.Suspense>
      </div>
      <div className="h-52">
        <React.Suspense
          fallback={
            <div className="h-full flex items-center justify-center text-sm font-normal text-muted-foreground">
              Loading 3D view...
            </div>
          }
        >
          <LazyRoute3D points={points} />
        </React.Suspense>
      </div>
      <ElevationChart points={points} activeIndex={hoverIdx} />
    </div>
  );
}

