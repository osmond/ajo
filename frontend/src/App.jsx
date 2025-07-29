import React from "react";
import DashboardPage from "@/components/DashboardPage";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-[1200px]">
        <DashboardPage />
      </main>
    </div>
  );
}
