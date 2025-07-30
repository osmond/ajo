import React from "react";
import ChartCard from "./ChartCard";
import Skeleton from "./ui/Skeleton";
import { Sankey, Tooltip, ResponsiveContainer } from "recharts";
import { fetchActivities } from "../api";

export function bucketTimeOfDay(dateStr) {
  const h = new Date(dateStr).getHours();
  if (h < 6) return "Night";
  if (h < 12) return "Morning";
  if (h < 18) return "Afternoon";
  return "Evening";
}

export function bucketDayType(dateStr) {
  const d = new Date(dateStr).getDay();
  return d === 0 || d === 6 ? "Weekend" : "Weekday";
}

export function computeActivityFlows(activities = []) {
  const acts = [...activities].sort(
    (a, b) => new Date(a.startTimeLocal) - new Date(b.startTimeLocal)
  );
  const flows = {};
  const nodes = new Set();
  for (let i = 0; i < acts.length - 1; i++) {
    const cur = acts[i];
    const next = acts[i + 1];
    const fromTime = bucketTimeOfDay(cur.startTimeLocal);
    const toTime = bucketTimeOfDay(next.startTimeLocal);
    const timeKey = `${fromTime}|${toTime}`;
    flows[timeKey] = (flows[timeKey] || 0) + 1;
    nodes.add(fromTime);
    nodes.add(toTime);

    const fromDay = bucketDayType(cur.startTimeLocal);
    const toDay = bucketDayType(next.startTimeLocal);
    const dayKey = `${fromDay}|${toDay}`;
    flows[dayKey] = (flows[dayKey] || 0) + 1;
    nodes.add(fromDay);
    nodes.add(toDay);
  }
  const nodeArr = Array.from(nodes).map((name) => ({ name }));
  const idx = {};
  nodeArr.forEach((n, i) => {
    idx[n.name] = i;
  });
  const links = Object.entries(flows).map(([key, value]) => {
    const [s, t] = key.split("|");
    return { source: idx[s], target: idx[t], value };
  });
  return { nodes: nodeArr, links };
}

export default function ActivityFlowSankeyChart() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchActivities({ limit: 1000 })
      .then((acts) => setData(computeActivityFlows(acts)))
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ChartCard title="Activity Flow">
      <div className="h-64">
        {loading && <Skeleton className="h-full w-full" />}
        {error && (
          <div className="flex h-full items-center justify-center text-sm font-normal text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && data && (
          <ResponsiveContainer width="100%" height="100%">
            <Sankey data={data} nodePadding={20} linkCurvature={0.5}>
              <Tooltip />
            </Sankey>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}

