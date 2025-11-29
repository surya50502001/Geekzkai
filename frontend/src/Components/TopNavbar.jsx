import { Search, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function TopNavbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="hidden md:flex border-b border-black dark:border-white bg-white dark:bg-black backdrop-blur-md p-4 items-center sticky top-0 z-40" style={{ marginLeft: 'var(--sidebar-width, 0px)' }}>
            <div className="flex-1">
                <Link to="/" className="text-2xl font-bold text-black dark:text-white">
                    GeekzKai
                </Link>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="flex items-center gap-2 bg-white dark:bg-black px-4 py-2 rounded-full border border-black dark:border-white focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white focus-within:border-transparent transition-all">
                    <Search size={18} className="text-black dark:text-white" />
                    <input
                        type="text"
                        placeholder="Search discussions..."
                        className="bg-transparent focus:outline-none text-black dark:text-white placeholder-black dark:placeholder-white w-64"
                    />
                </div>

                {user ? (
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <button className="p-2 hover:bg-white dark:hover:bg-black rounded-full transition-colors relative">
                            <Bell size={20} className="text-black dark:text-white" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Menu */}
                        <div className="flex items-center gap-2">
                            <Link 
                                to="/profile" 
                                className="flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-black rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                                    <User size={16} className="text-white dark:text-black" />
                                </div>
                                <span className="text-sm font-medium text-black dark:text-white">{user.username}</span>
                            </Link>
                            <button 
                                onClick={logout}
                                className="text-sm text-black dark:text-white hover:text-black dark:hover:text-white px-3 py-1 rounded transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link 
                            to="/login" 
                            className="px-4 py-2 text-black dark:text-white hover:text-black dark:hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 font-medium"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}

                <ThemeToggle />
            </div>
        </nav>
    );
}