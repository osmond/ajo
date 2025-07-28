import React from "react";
import ChartCard from "./ChartCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchSteps, fetchHeartrate } from "../api";

export default function TrendsSection() {
  const [steps, setSteps] = React.useState([]);
  const [hr, setHr] = React.useState([]);
  const [loadingSteps, setLoadingSteps] = React.useState(true);
  const [loadingHr, setLoadingHr] = React.useState(true);
  const [errorSteps, setErrorSteps] = React.useState(null);
  const [errorHr, setErrorHr] = React.useState(null);

  React.useEffect(() => {
    fetchSteps()
      .then(setSteps)
      .catch(() => setErrorSteps("Failed to load"))
      .finally(() => setLoadingSteps(false));
    fetchHeartrate()
      .then(setHr)
      .catch(() => setErrorHr("Failed to load"))
      .finally(() => setLoadingHr(false));
  }, []);

  return (
    <Tabs defaultValue="steps" className="space-y-4">
      <TabsList>
        <TabsTrigger value="steps">Steps</TabsTrigger>
        <TabsTrigger value="heartrate">Heart Rate</TabsTrigger>
      </TabsList>
      <TabsContent value="steps">
        <ChartCard title="Step Trend">
          <div className="h-40">
            {loadingSteps && (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Loading...
              </div>
            )}
            {errorSteps && (
              <div className="flex h-full items-center justify-center text-sm text-destructive">
                {errorSteps}
              </div>
            )}
            {!loadingSteps && !errorSteps && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={steps} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tick={false} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </TabsContent>
      <TabsContent value="heartrate">
        <ChartCard title="Heart Rate Trend">
          <div className="h-40">
            {loadingHr && (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Loading...
              </div>
            )}
            {errorHr && (
              <div className="flex h-full items-center justify-center text-sm text-destructive">
                {errorHr}
              </div>
            )}
            {!loadingHr && !errorHr && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hr} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tick={false} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#ef4444" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </TabsContent>
    </Tabs>
  );
}
