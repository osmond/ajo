import React from "react";
import ChartCard from "./ChartCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

export default function TrendsSection() {
  return (
    <Tabs defaultValue="steps" className="space-y-4">
      <TabsList>
        <TabsTrigger value="steps">Steps</TabsTrigger>
        <TabsTrigger value="heartrate">Heart Rate</TabsTrigger>
      </TabsList>
      <TabsContent value="steps">
        <ChartCard title="Step Trend">
          <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
            Chart
          </div>
        </ChartCard>
      </TabsContent>
      <TabsContent value="heartrate">
        <ChartCard title="Heart Rate Trend">
          <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
            Chart
          </div>
        </ChartCard>
      </TabsContent>
    </Tabs>
  );
}
