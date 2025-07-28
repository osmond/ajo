import React from "react";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Garmin Activity Dashboard</CardTitle>
        <DarkModeToggle />
      </CardHeader>
    </Card>
  );
}
