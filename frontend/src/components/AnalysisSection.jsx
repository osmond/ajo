import React from "react";
import DemoCharts from "./DemoCharts/DemoCharts";
import WeatherImpactBubbleChart from "./WeatherImpactBubbleChart";

export default function AnalysisSection() {
  return (
    <div className="space-y-10">
      <DemoCharts />
      <WeatherImpactBubbleChart />
    </div>
  );
}
