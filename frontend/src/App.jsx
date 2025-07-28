import React from "react";
import Header from "./components/Header";
import KPIGrid from "./components/KPIGrid";
import TrendsSection from "./components/TrendsSection";
import MapSection from "./components/MapSection";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto space-y-6 py-6">
        <KPIGrid />
        <TrendsSection />
        <MapSection />
      </main>
    </div>
  );
}
