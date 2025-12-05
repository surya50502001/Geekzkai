import { Home, User, Search, Plus, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function BottomNavbar() {
    const location = useLocation();

    const navItems = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/create", icon: Plus, label: "Create" },
        { to: "/search", icon: Search, label: "Search" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/trending", icon: TrendingUp, label: "Trending" },
    ];

    return (
        <>
            <nav className="bottom-nav-fixed fixed bottom-0 left-0 right-0 p-2 flex justify-around items-center md:hidden border-t" style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to;

                    return (
                        <Link
                            key={item.label}
                            to={item.to}
                            className="flex flex-col items-center p-2 transition-colors"
                            style={{color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'}}
                        >
                            <Icon size={24} />
                            <span className="text-xs mt-1">{item.label}</span>
                        </Link>
                    );
                })}
                <ThemeToggle />
            </nav>

        </>
    );
}
