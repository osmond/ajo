import React from "react";
import Header from "./components/Header";
import KPIGrid from "./components/KPIGrid";
import TrendsSection from "./components/TrendsSection";
import DailyHeatmap from "./components/DailyHeatmap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/Tabs";
const MapSection = React.lazy(() => import("./components/MapSection"));
const AnalysisSection = React.lazy(() => import("./components/AnalysisSection"));

export default function App() {
  const [tab, setTab] = React.useState("dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header tab={tab} onTabChange={setTab} />
      <main className="container mx-auto space-y-6 py-6">
        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-6">
            <KPIGrid />
            <TrendsSection />
            <DailyHeatmap />
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
        </Tabs>
      </main>
    </div>
  );
}
