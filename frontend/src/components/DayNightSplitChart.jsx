import React from "react";
import { PieChart, Pie, Tooltip, Cell, Label, ResponsiveContainer } from "recharts";
import { fetchActivities } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import Skeleton from "./ui/Skeleton";

export function computeDayNightMiles(activities = []) {
  let day = 0;
  let night = 0;
  for (const act of activities) {
    const hour = new Date(act.startTimeLocal).getHours();
    const miles = act.distance / 1609.34;
    if (hour >= 6 && hour < 18) {
      day += miles;
    } else {
      night += miles;
    }
  }
  return { day, night };
}

const COLORS = ["hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--muted-foreground))"];

export default function DayNightSplitChart() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchActivities()
      .then((acts) => {
        const { day, night } = computeDayNightMiles(acts);
        const total = day + night;
        setData({ day, night, total });
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const chartData = data
    ? [
        { name: "day", value: data.day },
        { name: "remainderDay", value: Math.max(data.total - data.day, 0) },
        { name: "night", value: data.night },
        { name: "remainderNight", value: Math.max(data.total - data.night, 0) },
      ]
    : [];

  return (
    <Card className="animate-in fade-in">
      <CardHeader>
        <CardTitle>Day/Night Activity Split</CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        {loading && <Skeleton className="h-full w-full" />}
        {error && (
          <div className="flex h-full items-center justify-center text-sm font-normal text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && data && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Day inner ring */}
              <Pie
                data={chartData.slice(0, 2)}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill={COLORS[0]} />
                <Cell fill={COLORS[2]} />
                <Label value={`${data.total.toFixed(1)} mi`} position="center" />
              </Pie>
              {/* Night outer ring */}
              <Pie
                data={chartData.slice(2)}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={90}
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill={COLORS[1]} />
                <Cell fill={COLORS[2]} />
              </Pie>
              <Tooltip
                formatter={(v, name) => [`${v.toFixed(1)} mi`, name === 'day' ? 'Day' : name === 'night' ? 'Night' : '']}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
