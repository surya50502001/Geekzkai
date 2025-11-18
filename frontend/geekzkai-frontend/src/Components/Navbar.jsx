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
    //const [open, SetOpen] = useState(false);

    const handleProfileClick = () => {
        if (user) navigate("/profile");
        else navigate("/login");
    };

   

    return (
        <nav className="fixed bottom-0 left-0 right-0 p-2 flex justify-between items-center text-text-primary animated-gradient font-sans z-40">
            <Link to="/" className="font-bold text-xl text-white">GeekzKai</Link>
            {navLinks.map((link) => (
                <Link key={link.to} to={link.to} aria-label={link.label} className="flex items-center gap-3 p-3 w-full rounded-lg text-black/60 hover:bg-black/30 transition-all duration-200 font-medium">
                    {link.icon}
                    <span>{link.label}</span>
                </Link>
            ))}
            <button onClick={handleProfileClick} aria-label="Profile" className="flex items-center gap-3 p-3 w-full rounded-lg text-black/60  hover:bg-black/30 transition-all duration-200 font-medium">
                <User size={20} />
                <span>Profile</span>
            </button>
            <div className="flex items-center justify-between w-full px-3 py-2 border-t border-border-primary pt-4 text-black/60">
                <span className="font-semibold text-text-secondary">Theme</span>
                <ThemeToggle />
            </div>

        </nav>
    )
}

export default Navbar
