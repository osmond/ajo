import React from "react";
import { Card, CardContent } from "./ui/Card";
import KPIGrid from "./KPIGrid";
import StepsSparkline from "./StepsSparkline";
import WeatherChart from "./WeatherChart";
import TemperatureChart from "./TemperatureChart";
import StatesVisited from "./StatesVisited";
import WeeklySummaryCard from "./WeeklySummaryCard";
const AnalysisSection = React.lazy(() => import("./AnalysisSection"));

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">

      <h2 className="text-sm font-medium text-muted-foreground mb-2">Activity Overview</h2>

      <WeeklySummaryCard />

      <React.Suspense
        fallback={
          <div className="h-64 flex items-center justify-center text-sm font-normal text-muted-foreground">
            Loading analysis...
          </div>
        }
      >
        <AnalysisSection />
      </React.Suspense>

      <div className="grid gap-6 sm:grid-cols-2">
        <TemperatureChart />
        <WeatherChart />
      </div>
      <StatesVisited />
      <Card className="animate-in fade-in">
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <StepsSparkline />
          </div>
          <KPIGrid />
        </CardContent>
      </Card>
    </div>
  );
}

