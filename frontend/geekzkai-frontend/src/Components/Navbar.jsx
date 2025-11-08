import { Link } from "react-router-dom"
import { Home, Compass, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../Context/ThemeContext";

const navLinks = [
    { to: "/", icon: <Home size={20} />, label: "Home" },
    { to: "/Explore", icon: <Compass size={20} />, label: "Explore" },
    { to: "/Profile", icon: <User size={20} />, label: "Profile" },
];


function Navbar() {
    const { theme } = useTheme();

    return (
        <nav className="p-2 flex justify-between items-center text-white relative overflow-hidden animated-gradient">
            <Link to="/" className="font-bold text-xl">GeekzKai</Link>
            <div className="flex gap-10 items-center ">
                {navLinks.map((link) => (
                    <Link key={link.to} to={link.to} aria-label={link.label} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                        {link.icon}
                    </Link>
                ))}
                <ThemeToggle />
            </div>
        </nav>
    )
}

export default Navbar
