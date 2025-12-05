import { Search, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function TopNavbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="hidden md:flex border-b backdrop-blur-md p-4 items-center sticky top-0 z-40" style={{ marginLeft: 'var(--sidebar-width, 0px)', backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
            <div className="flex-1">
                <Link to="/" className="text-2xl font-bold" style={{color: 'var(--text-primary)'}}>
                    GeekzKai
                </Link>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border focus-within:ring-2 focus-within:border-transparent transition-all" style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)'}}>
                    <Search size={18} style={{color: 'var(--text-primary)'}} />
                    <input
                        type="text"
                        placeholder="Search discussions..."
                        className="bg-transparent focus:outline-none w-64"
                        style={{color: 'var(--text-primary)'}}
                    />
                </div>

                {user ? (
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <button className="p-2 rounded-full transition-colors relative" style={{'&:hover': {backgroundColor: 'var(--bg-secondary)'}}}>
                            <Bell size={20} style={{color: 'var(--text-primary)'}} />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Menu */}
                        <div className="flex items-center gap-2">
                            <Link 
                                to="/profile" 
                                className="flex items-center gap-2 p-2 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--text-primary)'}}>
                                    <User size={16} style={{color: 'var(--bg-primary)'}} />
                                </div>
                                <span className="text-sm font-medium" style={{color: 'var(--text-primary)'}}>{user.username}</span>
                            </Link>
                            <button 
                                onClick={logout}
                                className="text-sm px-3 py-1 rounded transition-colors"
                                style={{color: 'var(--text-primary)'}}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : null}

                <ThemeToggle />
            </div>
        </nav>
    );
}