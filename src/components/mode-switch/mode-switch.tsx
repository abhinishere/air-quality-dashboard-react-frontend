import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ModeSwitch() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  function toggleTheme() {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      className="toggle-button"
      onClick={toggleTheme}
    >
      {isDarkMode ? <Moon className="icon" /> : <Sun className="icon"></Sun>}
    </button>
  );
}
