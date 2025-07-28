import React from "react";

export default function DarkModeToggle() {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    const prefers =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === null ? prefers : stored === "true";
    setEnabled(initial);
    if (initial) document.documentElement.classList.add("dark");
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("darkMode", next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-md border px-2 py-1 text-sm"
    >
      {enabled ? "Light" : "Dark"}
    </button>
  );
}
