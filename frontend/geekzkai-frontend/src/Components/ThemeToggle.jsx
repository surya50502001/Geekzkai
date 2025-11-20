import { useTheme } from "../Context/ThemeContext";

function ThemeToggle() {
  const { theme, nextTheme } = useTheme();

  return (
    <button
      onClick={nextTheme}
      className={`p-2 rounded-full font-semibold transition-all ${
        theme === "dark"
          ? "bg-white/20 text-white hover:bg-white/30"
          : "bg-black/20 text-black hover:bg-black/30"
      }`}
    >
      {theme === "dark" ? "🌙" : "🌀"}
    </button>
  );
}

export default ThemeToggle;
