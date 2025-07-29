import React from "react";
import WeeklySummaryCard from "./WeeklySummaryCard";
import SummaryCard from "./SummaryCard";
import KPIGrid from "./KPIGrid";
import TrendsSection from "./TrendsSection";
import RunHeatmap from "./RunHeatmap";
import CumulativeChart from "./CumulativeChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
const MapSection = React.lazy(() => import("./MapSection"));
const AnalysisSection = React.lazy(() => import("./AnalysisSection"));

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <WeeklySummaryCard />
      <SummaryCard>
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="mileage">Mileage</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-6">
            <KPIGrid />
            <TrendsSection />
            <RunHeatmap />
          </TabsContent>
          <TabsContent value="map" className="space-y-6">
            <React.Suspense
              fallback={
                <div className="h-64 flex items-center justify-center text-sm font-normal text-muted-foreground">
                  Loading map...
                </div>
              }
            >
              <MapSection />
            </React.Suspense>
          </TabsContent>
          <TabsContent value="analysis" className="space-y-6">
            <React.Suspense
              fallback={
                <div className="h-64 flex items-center justify-center text-sm font-normal text-muted-foreground">
                  Loading analysis...
                </div>
              }
            >
              <AnalysisSection />
            </React.Suspense>
          </TabsContent>
          <TabsContent value="mileage" className="space-y-6">
            <CumulativeChart />
          </TabsContent>
        </Tabs>
      </SummaryCard>
    </div>
  );
}
