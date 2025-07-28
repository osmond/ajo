import React from "react";
import { Card, CardHeader, CardTitle } from "./ui/Card";

export default function Header() {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Garmin Activity Dashboard</CardTitle>
      </CardHeader>
    </Card>
  );
}
