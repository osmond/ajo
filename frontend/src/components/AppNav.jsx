import React from "react";

export default function AppNav({ value, onChange }) {
  const items = [
    { label: "Dashboard", value: "dashboard" },
    { label: "Map", value: "map" },
    { label: "Analysis", value: "analysis" },
  ];
  return (
    <nav className="flex gap-2">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={
            "px-3 py-1.5 text-sm rounded-md" +
            (value === item.value
              ? " bg-accent text-accent-foreground shadow"
              : " text-muted-foreground hover:text-foreground")
          }
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
