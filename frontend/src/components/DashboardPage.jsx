import React from "react";
import WeeklySummaryCard from "./WeeklySummaryCard";
import SummaryCard from "./SummaryCard";
import { Card, CardContent } from "./ui/Card";
import KPIGrid from "./KPIGrid";
import StepsSparkline from "./StepsSparkline";
import HRZonesBar from "./HRZonesBar";
import CumulativeTimeChart from "./CumulativeTimeChart";
import CumulativeChart from "./CumulativeChart";
import ChartCard from "./ChartCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
const MapSection = React.lazy(() => import("./MapSection"));
const AnalysisSection = React.lazy(() => import("./AnalysisSection"));

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <WeeklySummaryCard />
      <SummaryCard />
      <Card className="animate-in fade-in">
        <CardContent className="space-y-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="mileage">Mileage</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-6">
            <KPIGrid />
            <div className="grid gap-6 sm:grid-cols-2">
              <StepsSparkline />
              <HRZonesBar />
              <CumulativeTimeChart />
              <CumulativeChart />
            </div>

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
        </CardContent>
      </Card>
    </div>
  );
}
