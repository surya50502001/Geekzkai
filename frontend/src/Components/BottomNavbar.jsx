import { Home, User, Search, Plus, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import SearchModal from "./SearchModal";

export default function BottomNavbar() {
    const location = useLocation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const navItems = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/create", icon: Plus, label: "Create" },
        { action: () => setIsSearchOpen(true), icon: Search, label: "Search" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/trending", icon: TrendingUp, label: "Trending" },
    ];

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 flex justify-around items-center md:hidden z-40">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = item.to && location.pathname === item.to;

                    if (item.action) {
                        return (
                            <button
                                key={item.label}
                                onClick={item.action}
                                className="flex flex-col items-center p-2 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            >
                                <Icon size={24} />
                                <span className="text-xs mt-1">{item.label}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`flex flex-col items-center p-2 transition-colors ${
                                isActive ? "text-blue-500" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            <Icon size={24} />
                            <span className="text-xs mt-1">{item.label}</span>
                        </Link>
                    );
                })}
                <ThemeToggle />
            </nav>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
