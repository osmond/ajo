import React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/Button";

export default function ModeToggle() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);
    updateFavicon(dark);
  }, []);

  function updateFavicon(dark) {
    const favicon = document.getElementById("favicon");
    if (favicon) {
      favicon.href = dark ? "/favicon-dark.svg" : "/favicon-light.svg";
    }
  }

  function toggle() {
    const root = document.documentElement;
    const newDark = !root.classList.contains("dark");
    root.classList.toggle("dark", newDark);
    localStorage.theme = newDark ? "dark" : "light";
    updateFavicon(newDark);
    setIsDark(newDark);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
