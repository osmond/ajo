import { states } from "@/data/states";

export default function Legend() {
  const visited = states.filter((s) => s.visited).length;
  const notVisited = states.length - visited;
  return (
    <div className="flex items-center gap-4 mt-4 text-sm">
      <div className="flex items-center gap-1">
        <span className="w-4 h-4 bg-muted border rounded-sm"></span>
        <span>Not visited ({notVisited})</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-4 h-4 bg-foreground rounded-sm"></span>
        <span>Visited ({visited})</span>
      </div>
    </div>
  );
}
