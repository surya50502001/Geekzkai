import { useTheme } from "../Context/ThemeContext";
import  Naruto  from "../assets/themes/naruto.png";
import  Sasuke  from "../assets/themes/sasuke.png";
import  Itachi from "../assets/themes/itachi.png";


function ThemeToggle() {
  const { theme, nextTheme } = useTheme();

  return (
    <button
      onClick={nextTheme}
      className="p-2 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition-all"
      >
          {theme === "naruto" && <img src={Naruto} className="w-6 h-6" />}
          {theme === "sasuke" && <img src={Sasuke} className="w-6 h-6" />}
          {theme === "itachi" && <img src={Itachi} className="w-6 h-6" />}
    </button>
  );
}

export default ThemeToggle;
