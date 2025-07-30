import { Flame } from "lucide-react";

export default function AnimatedFlame({ streak = 0 }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {/* Flame with subtle scale + color animation */}
        <Flame
          className="w-6 h-6 text-orange-400 animate-flame"
          strokeWidth={2}
        />
        {/* Soft glow inside a blurred circle */}
        <span className="absolute inset-0 rounded-full bg-orange-400 opacity-30 blur-md animate-glow"></span>
      </div>
      <span className="font-medium text-orange-400">{streak}</span>
    </div>
  );
}
