import { Home, User, Settings, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal";

export default function BottomNavbar() {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const navItems = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/settings", icon: Settings, label: "Settings" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/create", icon: Plus, label: "Create", action: openModal },
    ];

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 bg-background-secondary border-t border-border-primary p-2 flex justify-around items-center md:hidden z-40">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to && !item.action;

                    return item.action ? (
                        <button
                            key={item.label}
                            onClick={item.action}
                            className="flex flex-col items-center p-2 text-text-secondary hover:text-primary transition-colors"
                        >
                            <Icon size={24} className={isActive ? "text-primary" : ""} />
                            <span className="text-xs mt-1">{item.label}</span>
                        </button>
                    ) : (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`flex flex-col items-center p-2 transition-colors ${
                                isActive ? "text-primary" : "text-text-secondary hover:text-primary"
                            }`}
                        >
                            <Icon size={24} className={isActive ? "text-primary" : ""} />
                            <span className="text-xs mt-1">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <CreatePostModal isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
}
