import React from "react";
import ModeToggle from "./ModeToggle";

export default function NavBar({ page, setPage }) {
  const links = [
    { label: "Dashboard", value: "dashboard" },
    { label: "Charts", value: "charts" },
    { label: "Maps", value: "maps" },
    { label: "Components", value: "components" },
  ];

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between p-4">
        <div className="font-semibold">Garmin Dashboard</div>
        <nav className="flex items-center gap-3">
          {links.map((link) => (
            <button
              key={link.value}
              onClick={() => setPage(link.value)}
              className={
                "text-sm" + (page === link.value ? " font-semibold underline" : " underline")
              }
            >
              {link.label}
            </button>
          ))}
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
