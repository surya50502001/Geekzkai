import { Home, Search, Plus, MessageCircle, User, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";

export default function BottomNavbar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [showProfileMenu, setShowProfileMenu] = useState(false);


    // Close all modals when location changes
    useEffect(() => {
        setShowProfileMenu(false);

    }, [location.pathname]);

    const navItems = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/search", icon: Search, label: "Search" },
        { to: "/rooms", icon: Users, label: "Rooms" },
        { to: "/chat", icon: MessageCircle, label: "Chat" },
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
                
                {/* Create Button */}
                <Link
                    to="/create"
                    className="flex flex-col items-center p-2 transition-colors"
                    style={{color: 'var(--text-secondary)'}}
                >
                    <Plus size={24} />
                    <span className="text-xs mt-1">Create</span>
                </Link>
                

                
                {/* Profile Button */}
                <Link
                    to="/profile"
                    className="flex flex-col items-center p-2 transition-colors"
                    style={{color: location.pathname === '/profile' ? 'var(--text-primary)' : 'var(--text-secondary)'}}
                >
                    {user?.profilePictureUrl ? (
                        <img 
                            src={user.profilePictureUrl} 
                            alt={user.username}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                    ) : (
                        <User size={24} />
                    )}
                    <span className="text-xs mt-1">Profile</span>
                </Link>
            </nav>


            

        </>
    );
}
