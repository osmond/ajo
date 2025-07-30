import { states } from "@/data/states";

/**
 * Display grid of state abbreviations. Clicking a state
 * triggers the `onSelect` callback with the abbreviation.
 */
export default function StatesGrid({ onSelect, selected }) {
  return (
    <div className="grid grid-cols-12 grid-rows-7 gap-1">
      {states.map((s) => {
        const visitedClass = s.visited
          ? "bg-foreground text-background"
          : "bg-muted text-muted-foreground";
        const selectedClass = selected === s.abbr ? "ring-2 ring-primary" : "";
        return (
          <div
            key={s.abbr}
            style={{ gridColumn: s.col, gridRow: s.row }}
            onClick={() => onSelect?.(s.abbr)}
            className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-sm cursor-pointer ${visitedClass} ${selectedClass}`}
            title={`${s.name}${s.visited ? ` – ${s.days} days, ${s.miles} mi` : ""}`}
          >
            {s.abbr}
          </div>
        );
      })}
    </div>
  );
}
