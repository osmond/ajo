import React from "react";
import Header from "./components/Header";
import DashboardPage from "./components/DashboardPage";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto">
        <DashboardPage />
      </main>
    </div>
  );
}
