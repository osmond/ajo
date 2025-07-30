import { Flame } from "lucide-react";

export default function AnimatedFlame({ streak = 0 }) {
  const fillOpacity = Math.min(0.2 + streak * 0.05, 0.8);
  const fill = `rgba(249, 115, 22, ${fillOpacity})`;

  return (
    <div className="flex items-center gap-2">
      {/* Simple flame icon with animated outline */}
      <Flame
        className="w-6 h-6 animate-flame"
        strokeWidth={2}
        color="#f97316"
        fill={fill}
      />
      <span className="font-medium text-orange-400">{streak}</span>
    </div>
  );
}
