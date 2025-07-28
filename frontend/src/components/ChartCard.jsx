import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

export default function ChartCard({ title, children }) {
  return (
    <Card className="animate-in fade-in">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
