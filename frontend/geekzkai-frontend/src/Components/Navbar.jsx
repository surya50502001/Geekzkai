import { Link } from "react-router-dom"
import { Home, Compass, User, Menu, X, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const navLinks = [
    { to: "/", icon: <Home size={20} />, label: "Home" },
    { to: "/Explore", icon: <Compass size={20} />, label: "Explore" },
    { to: "/Profile", icon: <User size={20} />, label: "Profile" },
];


function Navbar() {
    const { theme } = useTheme();
    const { user } = useAuth(); // check if logged in
    const navigate = useNavigate();
    const [open, SetOpen] = useState(false);

    const handleProfileClick = () => {
        if (user) navigate("/profile");
        else navigate("/login");
    };

    const HandleMenuClick = () => {
        SetOpen(!open);
    }

    return (
        <nav className="p-2 flex justify-between items-center text-text-primary relative animated-gradient font-sans">
            <Link to="/" className="font-bold text-xl text-white">GeekzKai</Link>
            <div className="flex gap-2 items-center text-white">
                <button onClick={() => navigate("/settings")} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                    <Settings size={20} />
                </button>
                <button onClick={HandleMenuClick} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                    <Menu size={20} />
                </button>

                {open && (
                    <div className="absolute h-screen top-full right-0 w-48 flex flex-col items-start py-4 gap-3 bg-red font-semibold shadow-lg rounded-lg border border-border-primary z-50 animate-slideDown">
                        <button onClick={HandleMenuClick} className="self-end p-2 hover:bg-accent-primary/20 rounded-full transition-all duration-200">
                            <X size={20} />
                        </button>
                        {navLinks.map((link) => (
                            <Link key={link.to} to={link.to} aria-label={link.label} className="flex items-center gap-3 p-3 w-full rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 font-medium">
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        ))}
                        <button onClick={handleProfileClick} aria-label="Profile" className="flex items-center gap-3 p-3 w-full rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 font-medium">
                            <User size={20} />
                            <span>Profile</span>
                        </button>
                        <div className="flex items-center justify-between w-full px-3 py-2 border-t border-border-primary pt-4">
                            <span className="font-semibold text-text-secondary">Theme</span>
                            <ThemeToggle />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
