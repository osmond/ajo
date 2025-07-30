import React from "react";
import DashboardPage from "@/components/DashboardPage";
import AllChartsPage from "@/components/AllChartsPage";
import AllMapsPage from "@/components/AllMapsPage";
import AllComponentsPage from "@/components/AllComponentsPage";
import ModeToggle from "@/components/ModeToggle";

export default function App() {
  const [page, setPage] = React.useState("dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-4 flex justify-between">
        {page === "dashboard" ? (
          <div className="space-x-2">
            <button
              className="text-sm underline"
              onClick={() => setPage("charts")}
            >
              View All Charts
            </button>
            <button
              className="text-sm underline"
              onClick={() => setPage("maps")}
            >
              View All Maps
            </button>
            <button
              className="text-sm underline"
              onClick={() => setPage("components")}
            >
              View Components
            </button>
          </div>
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
        {page === "dashboard" ? (
          <DashboardPage />
        ) : page === "charts" ? (
          <AllChartsPage />
        ) : (
        ) : page === "maps" ? (
          <AllMapsPage />
        ) : (
          <AllComponentsPage />
        )}
      </main>
    </div>
  );
}
