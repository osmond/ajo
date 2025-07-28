import React from "react";
import { Button } from "./ui/Button";

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

  const SunIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-7.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 4.636M12 8a4 4 0 110 8 4 4 0 010-8z"
      />
    </svg>
  );

  const MoonIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );

  return (
    <Button
      onClick={toggle}
      aria-label="Toggle dark mode"
      variant="outline"
      size="sm"
    >
      {enabled ? SunIcon : MoonIcon}
    </Button>
  );
}
