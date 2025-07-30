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
  fetchRoutes,
} from "../api";
const LazyHeatmap = React.lazy(() => import("./RouteHeatmap"));

export default function MapSection() {
  const [routes, setRoutes] = React.useState([]);
  const [loadingRoutes, setLoadingRoutes] = React.useState(true);
  const [errorRoutes, setErrorRoutes] = React.useState(null);
  const [activityType, setActivityType] = React.useState("all");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  React.useEffect(() => {
    setLoadingRoutes(true);
    setErrorRoutes(null);
    fetchRoutes({
      activityType: activityType === "all" ? "" : activityType,
      startDate,
      endDate,
    })
      .then(setRoutes)
      .catch(() => setErrorRoutes("Failed to load routes"))
      .finally(() => setLoadingRoutes(false));
  }, [activityType, startDate, endDate]);

  return (
    <div className="space-y-6">
      <ChartCard title="Route Heatmap">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row">
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="run">Run</SelectItem>
              <SelectItem value="bike">Bike</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="date"
            className="rounded-md p-1 text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="rounded-md p-1 text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Card>
          <CardContent className="h-64 p-6">
            {loadingRoutes && (
              <div className="flex h-full items-center justify-center text-sm font-normal text-muted-foreground">
                Loading...
              </div>
            )}
            {errorRoutes && (
              <div className="flex h-full items-center justify-center text-sm font-normal text-destructive">
                {errorRoutes}
              </div>
            )}
            {!loadingRoutes && !errorRoutes && routes.length > 0 && (
              <React.Suspense
                fallback={
                  <div className="flex h-full items-center justify-center text-sm font-normal text-muted-foreground">
                    Loading map...
                  </div>
                }
              >
                <LazyHeatmap coords={routes} />
              </React.Suspense>
            )}
          </CardContent>
        </Card>
      </ChartCard>
    </div>
  );
}

