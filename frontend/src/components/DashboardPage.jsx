import React from "react";
import { Card, CardContent } from "./ui/Card";
import KPIGrid from "./KPIGrid";
import StepsSparkline from "./StepsSparkline";
import HRZonesBar from "./HRZonesBar";
import CumulativeTimeChart from "./CumulativeTimeChart";
import CumulativeChart from "./CumulativeChart";
const MapSection = React.lazy(() => import("./MapSection"));
const AnalysisSection = React.lazy(() => import("./AnalysisSection"));

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <Card className="animate-in fade-in">
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <StepsSparkline />
            <HRZonesBar />
            <CumulativeTimeChart />
            <CumulativeChart />
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
          <CumulativeChart />
          <KPIGrid />
        </CardContent>
      </Card>
    </div>
  );
}
