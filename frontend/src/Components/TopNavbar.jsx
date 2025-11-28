import { Search, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function TopNavbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="hidden md:flex border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 items-center sticky top-0 z-40" style={{ marginLeft: 'var(--sidebar-width, 0px)' }}>
            <div className="flex-1">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    GeekzKai
                </Link>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                    <Search size={18} className="text-gray-500 dark:text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search discussions..."
                        className="bg-transparent focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 w-64"
                    />
                </div>

                {user ? (
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
                            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Menu */}
                        <div className="flex items-center gap-2">
                            <Link 
                                to="/profile" 
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                                    <User size={16} className="text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.username}</span>
                            </Link>
                            <button 
                                onClick={logout}
                                className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 px-3 py-1 rounded transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link 
                            to="/login" 
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200 font-medium"
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