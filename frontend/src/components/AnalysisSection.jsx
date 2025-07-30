import React from "react";
import DemoCharts from "./DemoCharts/DemoCharts";
import CorrelationMap from "./CorrelationMap";

export default function AnalysisSection() {
  return (
    <div className="space-y-10">
      <DemoCharts />
      <CorrelationMap />
    </div>
  );
}
