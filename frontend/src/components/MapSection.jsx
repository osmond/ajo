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
const LazyRouteGlobe = React.lazy(() => import("./RouteGlobe"));

const RouteGallery = React.lazy(() => import("./RouteGallery"));

const LazyTimelineMap = React.lazy(() => import("./TimelineMap"));


export default function MapSection() {
  const [points, setPoints] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [metric, setMetric] = React.useState("heartRate");
  const [showWeather, setShowWeather] = React.useState(false);
  const [hoverIdx, setHoverIdx] = React.useState(null);
  const [viewMode, setViewMode] = React.useState("3d");

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
          {viewMode === "globe" ? (
            <LazyRouteGlobe points={points} />
          ) : (
            <LazyRoute3D points={points} />
          )}
        </React.Suspense>
        <div className="mt-1 flex justify-end">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3d">3D Track</SelectItem>
              <SelectItem value="globe">Globe</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ElevationChart points={points} activeIndex={hoverIdx} />

      <ChartCard title="Route Map">
        <div className="h-64">
          <React.Suspense fallback={<div className="h-full w-full bg-muted" />}> 
            <LazyMap
              points={points}
              metricKey={metric}
              showWeather={showWeather}
              onHoverPoint={setHoverIdx}
            />
          </React.Suspense>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="heartRate">Heart Rate</SelectItem>
              <SelectItem value="speed">Speed</SelectItem>
              <SelectItem value="elevation">Elevation</SelectItem>
            </SelectContent>
          </Select>
          <label className="ml-auto flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={showWeather}
              onChange={(e) => setShowWeather(e.target.checked)}
            />
            Weather
          </label>
        </div>
        <ElevationChart points={points} activeIndex={hoverIdx} />
      </ChartCard>
      <React.Suspense
        fallback={
          <div className="h-40 flex items-center justify-center text-sm font-normal text-muted-foreground">
            Loading routes...
          </div>
        }
      >
        <RouteGallery />
      </React.Suspense>

      <React.Suspense
        fallback={
          <div className="h-64 flex items-center justify-center text-sm font-normal text-muted-foreground">
            Loading timeline...
          </div>
        }
      >
        <LazyTimelineMap />
      </React.Suspense>

    </div>
  );
}

