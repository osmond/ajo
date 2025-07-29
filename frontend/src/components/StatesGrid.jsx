import { states } from "@/data/states";

export default function StatesGrid() {
  return (
    <div className="grid grid-cols-12 grid-rows-7 gap-1">
      {states.map((s) => (
        <div
          key={s.abbr}
          style={{ gridColumn: s.col, gridRow: s.row }}
          className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-sm cursor-pointer ${s.visited ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
          title={`${s.name}${s.visited ? ` – ${s.days} days, ${s.miles} mi` : ""}`}
        >
          {s.abbr}
        </div>
      ))}
    </div>
  );
}
