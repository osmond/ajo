import React from "react";
import ChartCard from "./ChartCard";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchAnalysis } from "../api";

export default function AnalysisSection() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchAnalysis()
      .then(setData)
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ChartCard title="Pace vs Temperature">
      <div className="h-64">
        {loading && (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading...</div>
        )}
        {error && (
          <div className="flex h-full items-center justify-center text-sm text-destructive">{error}</div>
        )}
        {!loading && !error && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey="temperature" name="Temp" unit="°C" />
              <YAxis dataKey="avgPace" name="Pace" unit="min/km" />
              <Tooltip />
              <Scatter data={data} fill="#2563eb" />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
