import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, User, Plus, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal"; // Import the modal component

function BottomNavbar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (e) => {
        e.preventDefault(); // Prevent navigation
        if (user) {
            setIsModalOpen(true);
        } else {
            navigate("/login");
        }
    };
    const closeModal = () => setIsModalOpen(false);

    const navLinks = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/create", icon: Plus, label: "Create", action: openModal },
        { to: "/profile", icon: User, label: "Profile" },
    ];

    const handleNavClick = (e, link) => {
        if (link.action) {
            link.action(e);
        } else if (!user) {
            e.preventDefault();
            navigate("/login");
        }
    };

    return (
        <>
            {/* Combined Mobile and Desktop Navbar */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center p-2 bg-background-secondary border-t border-border-primary
                            md:top-16 md:w-48 md:flex-col md:justify-start md:items-stretch md:p-4 md:border-t-0 md:border-r">
                
                {/* Desktop: Logo/Header (Optional) */}
                <div className="hidden md:block mb-4">
                    {/* You can place a logo or header here for the desktop sidebar */}
                </div>

                {/* Navigation Links */}
                <div className="flex justify-around w-full md:flex-col md:w-auto">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.to;
                        return (
                            <Link
                                key={link.label}
                                to={link.to}
                                onClick={(e) => handleNavClick(e, link)}
                                aria-label={link.label}
                                className={`flex flex-col items-center justify-center gap-1 text-text-secondary p-2 rounded-lg transition-all duration-200
                                            md:flex-row md:justify-start md:gap-3 md:p-3
                                            ${isActive ? 'text-primary' : 'hover:bg-primary/10 hover:text-text-primary'}`}
                            >
                                <link.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-xs font-medium md:text-base ${isActive ? 'font-semibold' : ''}`}>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop: Theme Toggle */}
                <div className="hidden md:block mt-auto">
                    <ThemeToggle />
                </div>
            </nav>
            {isModalOpen && <CreatePostModal closeModal={closeModal} />}
        </>
    );
}

export default BottomNavbar;
