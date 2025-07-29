import React from "react";
import DemoCharts from "./DemoCharts/DemoCharts";
import DemoWeatherCharts from "./DemoWeatherCharts";

export default function AnalysisSection() {

  return (
    <div className="space-y-10">
      <DemoCharts />
      <DemoWeatherCharts />
    </div>
  );
}
