import React from "react";
import DemoCharts from "./DemoCharts/DemoCharts";
import WhatIfScenarios from "./WhatIfScenarios";

export default function AnalysisSection() {
  return (
    <div className="space-y-10">
      <DemoCharts />
      <WhatIfScenarios />
    </div>
  );
}
