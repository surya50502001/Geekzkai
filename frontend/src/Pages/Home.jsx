import { useTheme } from "../Context/ThemeContext";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { Plus, TrendingUp, Users, MessageCircle, Star } from "lucide-react";

function Home() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://geekzkai.onrender.com/api";

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts`);
            if (response.ok) {
                const data = await response.json();
                setPosts(data.slice(0, 6));
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-purple-900 dark:via-purple-800 dark:to-purple-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5" />
                <div className="relative max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Star size={16} className="text-yellow-500" />
                            Welcome to GeekzKai Community
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                            GeekzKai 👾
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Your ultimate space to discuss anime theories, share "what if" ideas, and connect with fellow otaku from around the world!
                        </p>
                        
                        {user ? (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    to="/create" 
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <Plus size={20} />
                                    Create Post
                                </Link>
                                <Link 
                                    to="/trending" 
                                    className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <TrendingUp size={20} />
                                    Trending
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    to="/login" 
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Get Started
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Join Community
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="text-blue-600 dark:text-blue-400" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Active Community</h3>
                        <p className="text-gray-600 dark:text-gray-400">Connect with passionate anime fans worldwide</p>
                    </div>
                    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="text-purple-600 dark:text-purple-400" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Rich Discussions</h3>
                        <p className="text-gray-600 dark:text-gray-400">Dive deep into anime theories and analysis</p>
                    </div>
                    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="text-green-600 dark:text-green-400" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Trending Content</h3>
                        <p className="text-gray-600 dark:text-gray-400">Stay updated with the hottest anime topics</p>
                    </div>
                </div>
            </div>

            {/* Recent Posts Preview */}
            {posts.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Latest Discussions</h2>
                        <p className="text-gray-600 dark:text-gray-400">Check out what the community is talking about</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{post.question}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{post.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>By {post.user?.username || 'Anonymous'}</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link 
                            to="/trending" 
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                            View All Posts
                            <TrendingUp size={16} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;