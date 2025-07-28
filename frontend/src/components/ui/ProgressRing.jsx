import React from "react";

export default function ProgressRing({ value = 0, max = 100, size = 40, stroke = 4, className = "" }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;
  return (
    <svg width={size} height={size} className={className}>
      <circle
        className="text-muted-foreground opacity-20"
        stroke="currentColor"
        fill="transparent"
        strokeWidth={stroke}
        cx={size / 2}
        cy={size / 2}
        r={radius}
      />
      <circle
        className="text-primary transition-[stroke-dashoffset] duration-500 ease-out"
        stroke="currentColor"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        cx={size / 2}
        cy={size / 2}
        r={radius}
      />
    </svg>
  );
}
