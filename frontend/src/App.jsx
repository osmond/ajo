import React from "react";
import DashboardPage from "@/components/DashboardPage";
import AllChartsPage from "@/components/AllChartsPage";
import ModeToggle from "@/components/ModeToggle";

export default function App() {
  const [page, setPage] = React.useState("dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-4 flex justify-between">
        {page === "dashboard" ? (
          <button
            className="text-sm underline"
            onClick={() => setPage("charts")}
          >
            View All Charts
          </button>
        ) : (
          <button
            className="text-sm underline"
            onClick={() => setPage("dashboard")}
          >
            Back to Dashboard
          </button>
        )}
        <ModeToggle />
      </div>
      <main className="mx-auto max-w-[1200px]">
        {page === "dashboard" ? <DashboardPage /> : <AllChartsPage />}
      </main>
    </div>
  );
}
