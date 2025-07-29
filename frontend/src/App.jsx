import React from "react";
import Header from "./components/Header";
import KPIGrid from "./components/KPIGrid";
import TrendsSection from "./components/TrendsSection";
import DailyHeatmap from "./components/DailyHeatmap";
import RunHeatmap from "./components/RunHeatmap";
import CumulativeChart from "./components/CumulativeChart";
import SummaryCard from "./components/SummaryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/Tabs";
const MapSection = React.lazy(() => import("./components/MapSection"));
const AnalysisSection = React.lazy(() => import("./components/AnalysisSection"));

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto space-y-6 py-6">
        <SummaryCard />
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="mileage">Mileage</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-6">
            <KPIGrid />
            <TrendsSection />
            <DailyHeatmap />
            <RunHeatmap />
          </TabsContent>
          <TabsContent value="map" className="space-y-6">
            <React.Suspense
              fallback={
                <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
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
                <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
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
      </main>
    </div>
  );
}
