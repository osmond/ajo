import React from "react";
import WeeklySummaryCard from "./WeeklySummaryCard";

export default function Header() {
  return (
    <header className="container mx-auto flex items-center gap-4 py-4">
      <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
      <WeeklySummaryCard />
    </header>
  );
}
