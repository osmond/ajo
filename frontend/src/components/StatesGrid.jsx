import { states } from "@/data/states";
import Tooltip from "./ui/tooltip";

/**
 * Display grid of state abbreviations. Clicking a state
 * triggers the `onSelect` callback with the abbreviation.
 */
export default function StatesGrid({ onSelect, selected }) {
  return (
    <div className="grid grid-cols-12 grid-rows-7 gap-1">
      {states.map((s) => {
        const visitedClass = s.visited
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground";
        const selectedClass = selected === s.abbr ? "ring-2 ring-primary" : "";
        return (
          <Tooltip
            key={s.abbr}
            text={`${s.name}${s.visited ? ` – ${s.days} days, ${s.miles} mi` : ""}`}
          >
            <div
              style={{ gridColumn: s.col, gridRow: s.row }}
              onClick={() => onSelect?.(s.abbr)}
              className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-sm cursor-pointer ${visitedClass} ${selectedClass}`}
              aria-label={`${s.name}${s.visited ? ` – ${s.days} days, ${s.miles} mi` : ""}`}
            >
              {s.abbr}
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}
