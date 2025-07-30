import React from "react";

export default function ModeLegend({ treadmillPct = 0, outdoorPct = 0, colors = [] }) {
  const treadmillColor = colors[0] || 'hsl(var(--primary))';
  const outdoorColor = colors[1] || 'hsl(var(--muted-foreground))';
  return (
    <div className="flex items-center gap-4 mt-4 text-sm">
      <div className="flex items-center gap-1">
        <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: treadmillColor }}></span>
        <span>Treadmill ({treadmillPct.toFixed(0)}%)</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: outdoorColor }}></span>
        <span>Outdoor ({outdoorPct.toFixed(0)}%)</span>
      </div>
    </div>
  );
}
