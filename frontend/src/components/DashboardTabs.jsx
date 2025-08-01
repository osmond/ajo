import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/Tabs";
import WeeklySummaryCard from "./WeeklySummaryCard";
import StreakFlame from "./StreakFlame";
import KPIGrid from "./KPIGrid";
import FitnessScoreDial from "./FitnessScoreDial";
import TemperatureChart from "./TemperatureChart";
import WeatherChart from "./WeatherChart";
import WeeklyRingsDashboard from "./WeeklyRingsDashboard";
const AnalysisSection = React.lazy(() => import("./AnalysisSection"));
const LazyMapSection = React.lazy(() => import("./MapSection"));
const LazyVirtualPathMap = React.lazy(() => import("./VirtualPathMap"));

export default function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
        <TabsTrigger value="maps">Maps</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-6">
        <h2 className="text-base font-semibold">Activity Overview</h2>
        <WeeklySummaryCard>
          <StreakFlame />
        </WeeklySummaryCard>
        <div className="grid gap-6 sm:grid-cols-2">
          <TemperatureChart />
          <WeatherChart />
        </div>
        <KPIGrid />
        <FitnessScoreDial />
        <div className="flex justify-center">
          <WeeklyRingsDashboard />
        </div>
      </TabsContent>
      <TabsContent value="trends" className="space-y-10">
        <React.Suspense fallback={<div className="h-64 flex items-center justify-center text-sm font-normal text-muted-foreground">Loading analysis...</div>}>
          <AnalysisSection />
        </React.Suspense>
      </TabsContent>
      <TabsContent value="maps" className="space-y-6">
        <React.Suspense fallback={<div className="h-64 flex items-center justify-center text-sm font-normal text-muted-foreground">Loading maps...</div>}>
          <LazyMapSection />
        </React.Suspense>
        <React.Suspense fallback={<div className="h-64 flex items-center justify-center text-sm font-normal text-muted-foreground">Loading virtual path...</div>}>
          <LazyVirtualPathMap />
        </React.Suspense>
      </TabsContent>
    </Tabs>
  );
}
