import React from "react";
import { Card, CardHeader, CardTitle } from "./ui/Card";
import DarkModeToggle from "./DarkModeToggle";
import AppNav from "./AppNav";
export default function Header({ tab, onTabChange }) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Garmin Activity Dashboard</CardTitle>
        <AppNav value={tab} onChange={onTabChange} />
        <DarkModeToggle />
      </CardHeader>
    </Card>
  );
}
