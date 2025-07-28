import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import ProgressRing from "./ui/ProgressRing";

export default function KPIGrid() {
  const items = [
    { label: "Steps", value: 7000, goal: 10000 },
    { label: "Sleep", value: 6, goal: 8 },
    { label: "HR Avg", value: 75, goal: 100 },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader>
            <CardTitle>{item.label}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-32">
            <ProgressRing value={item.value} max={item.goal} size={80} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
