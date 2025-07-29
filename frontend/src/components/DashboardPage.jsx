import React from "react";
import { Card, CardContent } from "./ui/Card";
import KPIGrid from "./KPIGrid";
import StepsSparkline from "./StepsSparkline";
import WeatherChart from "./WeatherChart";
import TemperatureChart from "./TemperatureChart";
import StatesVisited from "./StatesVisited";
import WeeklySummaryCard from "./WeeklySummaryCard";
import SummaryCard from "./SummaryCard";
import TodayDistanceCard from "./TodayDistanceCard";
const MapSection = React.lazy(() => import("./MapSection"));
const AnalysisSection = React.lazy(() => import("./AnalysisSection"));

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">

      <h2 className="text-sm font-medium text-gray-600 mb-2">Activity Overview</h2>
      <TodayDistanceCard />
      <WeeklySummaryCard />
      <SummaryCard />

      <Card className="animate-in fade-in">
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <StepsSparkline />
          </div>
          <React.Suspense
            fallback={
              <div className="h-64 flex items-center justify-center text-sm font-normal text-muted-foreground">
                Loading map...
              </div>
            }
          >
            <MapSection />
          </React.Suspense>
          <React.Suspense
            fallback={
              <div className="h-64 flex items-center justify-center text-sm font-normal text-muted-foreground">
                Loading analysis...
              </div>
            }
          >
            <AnalysisSection />
          </React.Suspense>
          <KPIGrid />
          <div className="grid gap-6 sm:grid-cols-2">
            <TemperatureChart />
            <WeatherChart />
          </div>
        </CardContent>
      </Card>
      <StatesVisited />
    </div>
  );
}

