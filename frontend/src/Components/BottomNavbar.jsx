import { Home, Search, Plus, MessageCircle, User, X, Settings, LogOut, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";

import { useNotifications } from "../hooks/useNotifications";

export default function BottomNavbar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotifications();

    // Close all modals when location changes
    useEffect(() => {
        setShowProfileMenu(false);
        setShowNotifications(false);
    }, [location.pathname]);

    const navItems = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/search", icon: Search, label: "Search" },
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
                
                {/* Notifications Button */}
                <button 
                    onClick={() => {
                        setShowNotifications(true);
                        fetchNotifications();
                    }}
                    className="flex flex-col items-center p-2 transition-colors relative" 
                    style={{color: 'var(--text-secondary)'}}
                >
                    <Bell size={24} />
                    <span className="text-xs mt-1">Notifications</span>
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                </button>
                
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


            
            {/* Notifications Modal */}
            {showNotifications && (
                <div className="fixed inset-0 z-50 md:hidden" style={{backgroundColor: 'var(--bg-primary)'}}>
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b" style={{borderColor: 'var(--border-color)'}}>
                            <h2 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>Notifications</h2>
                            <button
                                onClick={() => setShowNotifications(false)}
                                className="p-2 rounded-lg transition-colors"
                                style={{color: 'var(--text-primary)'}}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 p-4">
                            {notifications.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <p style={{color: 'var(--text-secondary)'}}>No notifications yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => !notification.isRead && markAsRead(notification.id)}
                                            className="p-3 rounded-lg border cursor-pointer"
                                            style={{
                                                backgroundColor: notification.isRead ? 'transparent' : 'var(--bg-secondary)',
                                                borderColor: 'var(--border-color)'
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                {notification.fromUser.profilePictureUrl ? (
                                                    <img 
                                                        src={notification.fromUser.profilePictureUrl} 
                                                        alt={notification.fromUser.username}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <User size={16} />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-sm" style={{color: 'var(--text-primary)'}}>
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs" style={{color: 'var(--text-secondary)'}}>
                                                        {new Date(notification.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
