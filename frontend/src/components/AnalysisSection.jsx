import React from "react";
import DemoCharts from "./DemoCharts/DemoCharts";
import DayNightSplitChart from "./DayNightSplitChart";

export default function AnalysisSection() {
  return (
    <div className="space-y-10">
      <DayNightSplitChart />
      <DemoCharts />
    </div>
  );
}
