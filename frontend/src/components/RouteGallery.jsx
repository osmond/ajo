import React from "react";
import ChartCard from "./ChartCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/Carousel";
import Skeleton from "./ui/Skeleton";
import { fetchActivities, fetchActivityTrack } from "../api";
const LazyMap = React.lazy(() => import("./LeafletMap"));

export default function RouteGallery() {
  const [routes, setRoutes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchActivities({ limit: 5 })
      .then(async (acts) => {
        const withTracks = await Promise.all(
          acts.map(async (act) => {
            try {
              const pts = await fetchActivityTrack(act.activityId);
              return { id: act.activityId, distance: act.distance, points: pts };
            } catch (_) {
              return { id: act.activityId, distance: act.distance, points: [] };
            }
          })
        );
        setRoutes(withTracks);
      })
      .catch(() => setError("Failed to load routes"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ChartCard title="Route Gallery">
        <Skeleton className="h-40 w-full" />
      </ChartCard>
    );
  }
  if (error) {
    return (
      <ChartCard title="Route Gallery">
        <div className="text-sm font-normal text-destructive">{error}</div>
      </ChartCard>
    );
  }
  if (!routes.length) {
    return (
      <ChartCard title="Route Gallery">
        <div className="text-sm font-normal text-muted-foreground">No routes</div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Route Gallery">
      <Carousel className="w-full">
        <CarouselContent>
          {routes.map((r) => (
            <CarouselItem key={r.id} className="relative">
              <div className="h-40 overflow-hidden rounded-md">
                <React.Suspense fallback={<div className="h-full w-full bg-muted" />}>
                  <LazyMap points={r.points} />
                </React.Suspense>
              </div>
              <div className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-0.5 text-xs shadow">
                {(r.distance / 1000).toFixed(1)} km
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </ChartCard>
  );
}
