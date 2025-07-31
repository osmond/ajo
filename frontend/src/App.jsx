import React from "react";
import DashboardPage from "@/components/DashboardPage";
import AllChartsPage from "@/components/AllChartsPage";
import AllMapsPage from "@/components/AllMapsPage";
import AllComponentsPage from "@/components/AllComponentsPage";
import NavBar from "@/components/NavBar";

export default function App() {
  const [page, setPage] = React.useState("dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar page={page} setPage={setPage} />
      <main className="mx-auto max-w-[1200px]">
        {page === "dashboard" ? (
          <DashboardPage />
        ) : page === "charts" ? (
          <AllChartsPage />
        ) : page === "maps" ? (
          <AllMapsPage />
        ) : (
          <AllComponentsPage />
        )}
      </main>
    </div>
  );
}
