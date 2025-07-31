import React from "react";
import MapSection from "./MapSection";
import VirtualPathMap from "./VirtualPathMap";

export default function AllMapsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-lg font-semibold">All Maps</h1>
      <MapSection />
      <VirtualPathMap />
    </div>
  );
}
