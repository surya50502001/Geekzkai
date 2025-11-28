import { useState, useEffect } from "react";
import { X, Search, User, Clock } from "lucide-react";

export default function SearchModal({ isOpen, onClose }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://geekzkai.onrender.com/api";

    useEffect(() => {
        const saved = localStorage.getItem("recentSearches");
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            searchUsers();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const searchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/user/search?q=${searchQuery}`);
            if (response.ok) {
                const users = await response.json();
                setSearchResults(users);
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToRecentSearches = (user) => {
        const updated = [user, ...recentSearches.filter(u => u.id !== user.id)].slice(0, 10);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem("recentSearches");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
            <div className="bg-white dark:bg-gray-900 h-full">
                {/* Header */}
                <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={24} />
                    </button>
                    <h1 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">Search</h1>
                </div>

                {/* Search Input */}
                <div className="p-4">
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="px-4">
                    {searchQuery.trim() ? (
                        // Search Results
                        <div>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="space-y-2">
                                    {searchResults.map((user) => (
                                        <button
                                            key={user.id}
                                            onClick={() => {
                                                addToRecentSearches(user);
                                                onClose();
                                            }}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                                {user.profilePictureUrl ? (
                                                    <img src={user.profilePictureUrl} className="w-full h-full object-cover" alt="Profile" />
                                                ) : (
                                                    <User size={20} className="text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                                                {user.bio && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.bio}</p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">No users found</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Recent Searches
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-medium text-gray-900 dark:text-white">Recent</h2>
                                {recentSearches.length > 0 && (
                                    <button
                                        onClick={clearRecentSearches}
                                        className="text-sm text-blue-500 hover:text-blue-600"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                            {recentSearches.length > 0 ? (
                                <div className="space-y-2">
                                    {recentSearches.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-3 p-3"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                                {user.profilePictureUrl ? (
                                                    <img src={user.profilePictureUrl} className="w-full h-full object-cover" alt="Profile" />
                                                ) : (
                                                    <User size={20} className="text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                                                {user.bio && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.bio}</p>
                                                )}
                                            </div>
                                            <Clock size={16} className="text-gray-400" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Search size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">No recent searches</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}