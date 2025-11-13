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
        <nav className="p-2 flex justify-between items-center text-white relative animated-gradient">
            <Link to="/" className="font-bold text-xl">GeekzKai</Link>
            <div className="flex gap-10 items-center ">
                {navLinks.slice(0, 2).map((link) => (
                    <Link key={link.to} to={link.to} aria-label={link.label} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                        {link.icon}
                    </Link>
                ))}
                <button onClick={handleProfileClick} aria-label="Profile" className="p-2 rounded-full hover:bg-white/20 transition-colors">
                    <User size={20} />
                </button>

                <button onClick={HandleMenuClick} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>

                {open && (
                    <div className="absolute top-full left-0 w-50 h-screen  flex flex-col items-left py-4 gap-3 bg-white font-semibold shadow-md z-50 animate-slideDown">
                        <button onClick={HandleMenuClick} className="self-end p-2 text-white hover:bg-white/20 rounded-full">
                            <X size={20} />
                        </button>
                        <div className="flex items-center  ">
                            <span className="mx-2 text-black font-semibold">Theme</span>
                            <ThemeToggle />
                        </div>                       
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
