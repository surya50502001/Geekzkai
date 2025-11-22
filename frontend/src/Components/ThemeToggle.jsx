﻿import { useTheme } from "../Context/ThemeContext";

function ThemeToggle() {
  const { theme, nextTheme } = useTheme();

  const getIcon = () => {
    if (theme === "dark") return "🌙"; // Moon for dark
    if (theme === "light") return "☀️"; // Sun for light    
  };

  return (
    <button
      onClick={nextTheme}
      className={`p-2 rounded-full font-semibold transition-all ${
        theme === "dark"
          ? "bg-white/20 text-white hover:bg-white/30"
          : "bg-black/10 text-text-primary hover:bg-black/20"
      }`}
    >
      {getIcon()}
    </button>
  );
}

export default ThemeToggle;
