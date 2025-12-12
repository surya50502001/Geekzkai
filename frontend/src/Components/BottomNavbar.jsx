import { Home, Search, Plus, MessageCircle, User, X, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";

export default function BottomNavbar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const navItems = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/search", icon: Search, label: "Search" },
        { to: "/create", icon: Plus, label: "Create" },
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
                
                {/* Profile Button */}
                <button
                    onClick={() => setShowProfileMenu(true)}
                    className="flex flex-col items-center p-2 transition-colors"
                    style={{color: 'var(--text-secondary)'}}
                >
                    <User size={24} />
                    <span className="text-xs mt-1">Profile</span>
                </button>
            </nav>

            {/* Full Screen Profile Menu */}
            {showProfileMenu && (
                <div className="fixed inset-0 z-50 md:hidden" style={{backgroundColor: 'var(--bg-primary)'}}>
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b" style={{borderColor: 'var(--border-color)'}}>
                            <h2 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>Profile</h2>
                            <button
                                onClick={() => setShowProfileMenu(false)}
                                className="p-2 rounded-lg transition-colors"
                                style={{color: 'var(--text-primary)'}}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* User Info */}
                        {user && (
                            <div className="p-6 border-b" style={{borderColor: 'var(--border-color)'}}>
                                <div className="flex items-center gap-4">
                                    {user.profilePictureUrl ? (
                                        <img 
                                            src={user.profilePictureUrl} 
                                            alt={user.username}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--text-primary)'}}>
                                            <User size={32} style={{color: 'var(--bg-primary)'}} />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>{user.username}</h3>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Menu Items */}
                        <div className="flex-1 p-4">
                            <Link
                                to="/profile"
                                onClick={() => setShowProfileMenu(false)}
                                className="flex items-center gap-4 p-4 rounded-lg transition-colors mb-2 hover:opacity-80"
                                style={{color: 'var(--text-primary)', backgroundColor: 'transparent'}}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <User size={20} />
                                <span>View Profile</span>
                            </Link>

                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center gap-4 p-4 rounded-lg transition-colors mb-2 text-left hover:opacity-80"
                                style={{color: 'var(--text-primary)', backgroundColor: 'transparent'}}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <span className="text-xl">{isDark ? '☀️' : '🌙'}</span>
                                <span>Theme: {isDark ? 'Dark' : 'Light'}</span>
                            </button>

                            <Link
                                to="/settings"
                                onClick={() => setShowProfileMenu(false)}
                                className="flex items-center gap-4 p-4 rounded-lg transition-colors mb-2 hover:opacity-80"
                                style={{color: 'var(--text-primary)', backgroundColor: 'transparent'}}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <Settings size={20} />
                                <span>Settings</span>
                            </Link>

                            <button
                                onClick={() => {
                                    logout();
                                    setShowProfileMenu(false);
                                }}
                                className="w-full flex items-center gap-4 p-4 rounded-lg transition-colors text-left hover:opacity-80"
                                style={{color: 'var(--text-primary)', backgroundColor: 'transparent'}}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}
