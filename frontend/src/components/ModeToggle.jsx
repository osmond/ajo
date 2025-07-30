import React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/Button";

export default function ModeToggle() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const root = document.documentElement;
    const newDark = !root.classList.contains("dark");
    root.classList.toggle("dark", newDark);
    localStorage.theme = newDark ? "dark" : "light";
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
