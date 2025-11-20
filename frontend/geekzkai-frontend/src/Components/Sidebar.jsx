import { Home, User, Settings, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import Resizable from "./Resizable";

export default function Sidebar() {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const navItems = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/settings", icon: Settings, label: "Settings" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/create", icon: Plus, label: "Create", action: openModal || (() => {}) },
    ];

    return (
        <>
            <Resizable minWidth={0} maxWidth={window.innerWidth / 2}>
                <aside className="w-full h-full bg-background-secondary border-r border-border-primary p-4 flex flex-col bg-black/60">
                    
                    <nav className="flex-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.to && !item.action;

                            return item.action ? (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className="flex items-center p-3 w-full text-left text-text-secondary hover:text-primary hover:bg-background-tertiary rounded-lg transition-colors mb-2"
                                >
                                    <Icon size={20} className="mr-3" />
                                    <span>{item.label}</span>
                                </button>
                            ) : (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    className={`flex items-center p-3 rounded-lg transition-colors mb-2 ${
                                        isActive ? "text-primary bg-background-tertiary" : "text-text-secondary hover:text-primary hover:bg-background-tertiary"
                                    }`}
                                >
                                    <Icon size={20} className="mr-3" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>
            </Resizable>
        </>
    );
}
