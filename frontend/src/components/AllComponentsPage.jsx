import React from "react";

const componentPaths = Object.keys(
  import.meta.glob("./**/*.{jsx,tsx}")
).filter((p) => !p.includes("__tests__"));

export default function AllComponentsPage() {
  const names = React.useMemo(() => componentPaths.sort(), []);
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Component Files</h2>
      <ul className="list-disc ml-6 space-y-1">
        {names.map((name) => (
          <li key={name}>{name.replace(/^\.\//, "")}</li>
        ))}
      </ul>
    </div>
  );
}
