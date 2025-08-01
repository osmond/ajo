import React from "react";
import DemoCharts from "./DemoCharts/DemoCharts";
import WeatherImpactBubbleChart from "./WeatherImpactBubbleChart";

import DayNightSplitChart from "./DayNightSplitChart";

import CorrelationMap from "./CorrelationMap";

import WhatIfScenarios from "./WhatIfScenarios";



export default function AnalysisSection() {
  return (
    <div className="space-y-10">
      <DayNightSplitChart />
      <DemoCharts />

      <WeatherImpactBubbleChart />


      <CorrelationMap />

      <WhatIfScenarios />

    </div>
  );
}
