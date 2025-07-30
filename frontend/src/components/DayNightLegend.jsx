import React from "react";

export default function DayNightLegend({ dayMiles, nightMiles, totalMiles, colors = [] }) {
  const dayColor = colors[0] || 'hsl(var(--accent))';
  const nightColor = colors[1] || 'hsl(var(--primary))';
  const dayPct = totalMiles ? (dayMiles / totalMiles) * 100 : 0;
  const nightPct = totalMiles ? (nightMiles / totalMiles) * 100 : 0;
  return (
    <div className="flex items-center gap-4 mt-4 text-sm">
      <div className="flex items-center gap-1">
        <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: dayColor }}></span>
        <span>Day ({dayPct.toFixed(0)}%, {dayMiles.toFixed(1)} mi)</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: nightColor }}></span>
        <span>Night ({nightPct.toFixed(0)}%, {nightMiles.toFixed(1)} mi)</span>
      </div>
    </div>
  );
}
