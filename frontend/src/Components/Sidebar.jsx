import { Home, User, Settings, Plus, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Resizable from "./Resizable";

export default function Sidebar() {
    const location = useLocation();

    const navItems = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/create", icon: Plus, label: "Create" }, // FIXED
        { to: "/settings", icon: Settings, label: "Settings" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/trending", icon: TrendingUp, label: "Trending" },
    ];



    return (
        <Resizable minWidth={80} maxWidth={window.innerWidth / 2}>
            {(width) => (
                <aside
                    className="h-full bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col transition-all"
                    style={{
                        width: "100%",
                        opacity: width < 80 ? 1 : 1, // still visible
                    }}
                >
                    <nav className="flex-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.to;

                            return (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    className={`flex items-center p-3 rounded-lg transition-colors mb-2
                            ${isActive ? "text-black dark:text-white bg-gray-100 dark:bg-gray-800" : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}
                            ${width < 110 ? "justify-center" : ""}`}
                                >
                                    <Icon size={20} />
                                    {width > 130 && <span className="ml-3">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>
            )}
        </Resizable>

    );
}
