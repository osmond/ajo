import React from "react";
import { states } from "@/data/states";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import StatesGrid from "./StatesGrid";
import Legend from "./Legend";
import StatesTable from "./StatesTable";

export default function StatesVisited() {
  const visitedCount = states.filter((s) => s.visited).length;
  const [selected, setSelected] = React.useState(null);
  return (
    <Card className="animate-in fade-in">
      <CardHeader className="text-center">
        <CardTitle>US STATES VISITED</CardTitle>
        <p className="text-sm text-muted-foreground">
          {visitedCount} of 50 states visited
        </p>
      </CardHeader>
      <CardContent className="lg:flex lg:gap-8">
        <div className="flex-shrink-0">
          <StatesGrid onSelect={setSelected} selected={selected} />
          <Legend />
        </div>
        <div className="flex-1 mt-6 lg:mt-0">
          <StatesTable selected={selected} />
        </div>
      </CardContent>
    </Card>
  );
}
