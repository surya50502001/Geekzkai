import { Home, Settings, Plus, MessageCircle, Search, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Resizable from "./Resizable";

export default function Sidebar() {
    const location = useLocation();

    const navItems = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/create", icon: Plus, label: "Create" },
        { to: "/rooms", icon: Users, label: "Rooms" },
        { to: "/chat", icon: MessageCircle, label: "Chat" },
        { to: "/search", icon: Search, label: "Search" },
        { to: "/settings", icon: Settings, label: "Settings" },
    ];



    return (
        <Resizable minWidth={80} maxWidth={window.innerWidth / 2}>
            {(width) => (
                <aside
                    className="h-full border-r p-4 flex flex-col transition-all"
                    style={{
                        width: "100%",
                        opacity: width < 80 ? 1 : 1,
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
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
                                    className={`flex items-center p-3 rounded-lg transition-colors mb-2 ${width < 110 ? "justify-center" : ""}`}
                                    style={{
                                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent'
                                    }}
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
