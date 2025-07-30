import React from "react";

const modules = import.meta.glob("./**/*.{jsx,tsx}", { eager: true });

export default function AllComponentsPage() {
  const components = React.useMemo(
    () =>
      Object.entries(modules)
        .filter(
          ([path, mod]) =>
            !path.includes("__tests__") && typeof mod.default === "function"
        )
        .sort((a, b) => a[0].localeCompare(b[0])),
    []
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-lg font-semibold">Component Files</h2>
      <ul className="space-y-8">
        {components.map(([path, mod]) => {
          const Component = mod.default;
          return (
            <li key={path} className="space-y-2">
              <div className="font-mono">{path.replace(/^\.\//, "")}</div>
              <div className="border rounded p-4">
                <Component />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
