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

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
        (window.location.hostname === 'localhost' ? 'http://localhost:5131/api' : 'https://geekzkai.onrender.com/api');

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
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 animate-pulse"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)] animate-pulse"></div>
                
                <div className="relative max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-medium mb-6" style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}}>
                            <Star size={16} style={{color: 'var(--text-primary)'}} />
                            Welcome to GeekzKai Community
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                            GeekzKai 👾
                        </h1>
                        <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{color: 'var(--text-primary)'}}>
                            Your ultimate space to discuss anime theories, share "what if" ideas, and connect with fellow otaku from around the world!
                        </p>
                        
                        {user ? (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    to="/create" 
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                                >
                                    <Plus size={20} />
                                    Create Post
                                </Link>
                                <Link 
                                    to="/trending" 
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold border-2 border-purple-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:bg-purple-500 hover:text-white"
                                    style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                                >
                                    <TrendingUp size={20} />
                                    Trending
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    to="/login" 
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                                >
                                    Get Started
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold border-2 border-blue-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:bg-blue-500 hover:text-white"
                                    style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
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
                    <div className="text-center p-8 rounded-2xl shadow-lg border-2 border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2" style={{backgroundColor: 'var(--bg-secondary)'}}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500">
                            <Users className="text-white" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>Active Community</h3>
                        <p style={{color: 'var(--text-secondary)'}}>Connect with passionate anime fans worldwide</p>
                    </div>
                    <div className="text-center p-8 rounded-2xl shadow-lg border-2 border-blue-500/30 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2" style={{backgroundColor: 'var(--bg-secondary)'}}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500">
                            <MessageCircle className="text-white" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>Rich Discussions</h3>
                        <p style={{color: 'var(--text-secondary)'}}>Dive deep into anime theories and analysis</p>
                    </div>
                    <div className="text-center p-8 rounded-2xl shadow-lg border-2 border-green-500/30 hover:border-green-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2" style={{backgroundColor: 'var(--bg-secondary)'}}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500">
                            <TrendingUp className="text-white" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>Trending Content</h3>
                        <p style={{color: 'var(--text-secondary)'}}>Stay updated with the hottest anime topics</p>
                    </div>
                </div>
            </div>

            {/* Recent Posts Preview */}
            {posts.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4" style={{color: 'var(--text-primary)'}}>Latest Discussions</h2>
                        <p style={{color: 'var(--text-primary)'}}>Check out what the community is talking about</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
                                <h3 className="font-semibold mb-2 line-clamp-2" style={{color: 'var(--text-primary)'}}>{post.question}</h3>
                                <p className="text-sm mb-4 line-clamp-3" style={{color: 'var(--text-secondary)'}}>{post.description}</p>
                                <div className="flex items-center justify-between text-xs" style={{color: 'var(--text-secondary)'}}>
                                    <span>By {post.user?.username || 'Anonymous'}</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link 
                            to="/trending" 
                            className="inline-flex items-center gap-2 text-black dark:text-white hover:text-black dark:hover:text-white font-medium"
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