import * as React from "react";
import { cn } from "@/lib/utils";

export const Progress = React.forwardRef(
  ({ value = 0, max = 100, className = "", ...props }, ref) => {
    const percent = Math.max(0, Math.min(100, (value / max) * 100));
    return (
      <div
        ref={ref}
        className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <div
          className="h-full bg-primary transition-all"
          style={{ width: percent + "%" }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";
