import { useTheme } from "../Context/ThemeContext";

function ThemeToggle() {
  const { theme, nextTheme } = useTheme();

  return (
    <button
      onClick={nextTheme}
      className="p-2 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition-all"
    >
      {theme === "light" ? "🌞" : "🌙"}
    </button>
  );
}

export default ThemeToggle;
