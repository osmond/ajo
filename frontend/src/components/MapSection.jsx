import React from "react";
import ChartCard from "./ChartCard";
import ActivityCalendar from "./ActivityCalendar";
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
      <ChartCard title="Activity Map">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="sm:w-1/4 flex flex-col gap-2">
            <ActivityCalendar onSelect={loadTrack} />
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="heartRate">Heart Rate</SelectItem>
              <SelectItem value="speed">Speed</SelectItem>
            </SelectContent>
          </Select>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={showWeather}
              onChange={(e) => setShowWeather(e.target.checked)}
            />
            Weather
          </label>
        </div>
          <Card className="flex-1">
            <CardContent className="h-64 p-6">
              {loading && (
                <div className="flex h-full items-center justify-center text-sm font-normal text-muted-foreground">
                  Loading...
                </div>
              )}
              {error && (
                <div className="flex h-full items-center justify-center text-sm font-normal text-destructive">
                  {error}
                </div>
              )}
              {!loading && !error && points.length > 0 && (
                <React.Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center text-sm font-normal text-muted-foreground">
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
              )}
            </CardContent>
          </Card>
        </div>
      </ChartCard>
      {points.length > 0 && (
        <ElevationChart points={points} activeIndex={hoverIdx} />
      )}
    </div>
  );
}

