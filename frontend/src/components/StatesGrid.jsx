import { states } from "@/data/states";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/Popover";
import { getCities } from "@/data/stateCities";

export default function StatesGrid() {
  return (
    <div className="grid grid-cols-12 grid-rows-7 gap-1">
      {states.map((s) => (
        <Popover key={s.abbr}>
          <PopoverTrigger asChild>
            <div
              style={{ gridColumn: s.col, gridRow: s.row }}
              className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-sm cursor-pointer ${s.visited ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
              title={`${s.name}${s.visited ? ` – ${s.days} days, ${s.miles} mi` : ""}`}
            >
              {s.abbr}
            </div>
          </PopoverTrigger>
          <PopoverContent className="text-xs">
            <div className="font-semibold mb-1">{s.name}</div>
            <ul className="list-disc pl-4">
              {getCities(s.abbr).map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
