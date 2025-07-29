import React from "react";
import StepsSparkline from "./StepsSparkline";
import HRZonesBar from "./HRZonesBar";

export default function TrendsSection() {
  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <StepsSparkline />
      <HRZonesBar />
    </div>
  );
}
