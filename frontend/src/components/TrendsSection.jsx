import React from "react";
import ChartCard from "./ChartCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from "recharts";
import { fetchSteps, fetchHeartrate } from "../api";

export default function TrendsSection() {
  const [steps, setSteps] = React.useState([]);
  const [hr, setHr] = React.useState([]);
  const [loadingSteps, setLoadingSteps] = React.useState(true);
  const [loadingHr, setLoadingHr] = React.useState(true);
  const [errorSteps, setErrorSteps] = React.useState(null);
  const [errorHr, setErrorHr] = React.useState(null);
  const stepsGradientId = React.useId();
  const hrGradientId = React.useId();

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
                <AreaChart data={steps} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id={stepsGradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tick={false} />
                  <YAxis />
                  <Tooltip />
                  <ReferenceLine y={10000} stroke="hsl(var(--primary))" strokeDasharray="3 3" label={{ position: 'right', value: 'Goal' }} />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill={`url(#${stepsGradientId})`} dot={false} />
                  <Brush dataKey="timestamp" height={20} travellerWidth={10} />
                </AreaChart>
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
                <AreaChart data={hr} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id={hrGradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tick={false} />
                  <YAxis />
                  <Tooltip />
                  <ReferenceLine y={100} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ position: 'right', value: 'Goal' }} />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--destructive))" fill={`url(#${hrGradientId})`} dot={false} />
                  <Brush dataKey="timestamp" height={20} travellerWidth={10} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </TabsContent>
    </Tabs>
  );
}
