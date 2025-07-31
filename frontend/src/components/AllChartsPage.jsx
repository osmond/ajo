import React from "react";
import WeeklySummaryCard from "./WeeklySummaryCard";
import StreakFlame from "./StreakFlame";
import TemperatureChart from "./TemperatureChart";
import WeatherChart from "./WeatherChart";
import KPIGrid from "./KPIGrid";
import FitnessScoreDial from "./FitnessScoreDial";
import WeeklyRingsDashboard from "./WeeklyRingsDashboard";
import AnalysisSection from "./AnalysisSection";

export default function AllChartsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-lg font-semibold">All Charts</h1>
      <WeeklySummaryCard>
        <StreakFlame />
      </WeeklySummaryCard>
      <div className="grid gap-6 sm:grid-cols-2">
        <TemperatureChart />
        <WeatherChart />
      </div>
      <KPIGrid />
      <FitnessScoreDial />
      <div className="flex justify-center">
        <WeeklyRingsDashboard />
      </div>
      <AnalysisSection />
    </div>
  );
}
