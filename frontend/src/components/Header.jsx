import React from "react";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  return (
    <Card className="mb-4">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Garmin Activity Dashboard</CardTitle>
        <DarkModeToggle />
      </CardHeader>
    </Card>
  );
}
