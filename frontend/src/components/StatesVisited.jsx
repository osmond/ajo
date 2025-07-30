import { states } from "@/data/states";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import StatesGrid from "./StatesGrid";
import Legend from "./Legend";
import StatesTable from "./StatesTable";

export default function StatesVisited() {
  const visitedCount = states.filter((s) => s.visited).length;
  return (
    <Card className="animate-in fade-in">
      <CardHeader className="text-center mb-2">
        <CardTitle>US STATES VISITED</CardTitle>
        <p className="text-sm text-muted-foreground">
          {visitedCount} of 50 states visited
        </p>
      </CardHeader>
      <CardContent className="lg:flex lg:gap-8">
        <div className="flex-shrink-0">
          <StatesGrid />
          <Legend />
        </div>
        <div className="flex-1 mt-6 lg:mt-0">
          <StatesTable />
        </div>
      </CardContent>
    </Card>
  );
}
