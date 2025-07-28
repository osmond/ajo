import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import ProgressRing from "./ui/ProgressRing";
import { fetchHeartrate, fetchSleep, fetchSteps } from "../api";

export default function KPIGrid() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let interval;
    async function load() {
      try {
        const [steps, hr, sleep] = await Promise.all([
          fetchSteps(),
          fetchHeartrate(),
          fetchSleep(),
        ]);

        const latestSteps = steps[steps.length - 1]?.value ?? 0;
        const avgHr = Math.round(
          hr.reduce((sum, p) => sum + p.value, 0) / (hr.length || 1)
        );
        const lastSleep = sleep[sleep.length - 1]?.value ?? 0;

        setItems([
          { label: "Steps", value: latestSteps, goal: 10000 },
          { label: "Sleep", value: lastSleep, goal: 8 },
          { label: "HR Avg", value: avgHr, goal: 100 },
        ]);
      } catch (err) {
        setError("Failed to load metrics");
      } finally {
        setLoading(false);
      }
    }
    load();
    interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {loading && (
        <div className="col-span-3 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      )}
      {error && (
        <div className="col-span-3 text-center text-sm text-destructive">{error}</div>
      )}
      {!loading && !error &&
        items.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle>{item.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32">
              <ProgressRing value={item.value} max={item.goal} size={80} />
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
