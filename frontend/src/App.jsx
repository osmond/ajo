import React from "react";
import DashboardPage from "@/components/DashboardPage";
import ModeToggle from "@/components/ModeToggle";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-4 flex justify-end">
        <ModeToggle />
      </div>
      <main className="mx-auto max-w-[1200px]">
        <DashboardPage />
      </main>
    </div>
  );
}
