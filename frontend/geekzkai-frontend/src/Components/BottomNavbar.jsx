import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, User, Plus } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../Context/AuthContext";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import Resizable from "./Resizable";
import useMediaQuery from "../hooks/useMediaQuery";

function BottomNavbar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const openModal = (e) => {
        e.preventDefault();
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

    const desktopNav = (
        <Resizable>
            <nav className="z-40 w-full h-full flex-col justify-start items-stretch p-4 animated-gradient border-border-primary border rounded-lg shadow-xl flex animate-gradient">
                <div className="mb-4">
                    {/* You can place a logo or header here for the desktop sidebar */}
                </div>
                <div className="flex flex-col w-full">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.to;
                        return (
                            <Link
                                key={link.label}
                                to={link.to}
                                onClick={(e) => handleNavClick(e, link)}
                                aria-label={link.label}
                                className={`flex-row justify-start gap-3 p-3 flex items-center w-full text-white rounded-lg transition-all duration-200
                                            ${isActive ? 'text-white font-bold' : 'hover:bg-white/10 hover:text-white'}`}
                            >
                                <link.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-base ${isActive ? 'font-semibold' : 'font-medium'}`}>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </Resizable>
    );

    const mobileNav = (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center p-2 bg-background-secondary border-t border-border-primary">
            {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                    <Link
                        key={link.label}
                        to={link.to}
                        onClick={(e) => handleNavClick(e, link)}
                        aria-label={link.label}
                        className={`flex flex-col items-center justify-center gap-1 text-text-secondary p-2 rounded-lg transition-all duration-200
                                    ${isActive ? 'text-primary' : 'hover:bg-primary/10 hover:text-text-primary'}`}
                    >
                        <link.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>{link.label}</span>
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            {isDesktop ? desktopNav : mobileNav}
            {isModalOpen && <CreatePostModal closeModal={closeModal} />}
        </>
    );
}

export default BottomNavbar;
