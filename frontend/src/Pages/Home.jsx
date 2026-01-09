import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { TrendingUp, Users, MessageCircle, Star, UserPlus } from "lucide-react";
import API_BASE_URL from "../apiConfig";
import FollowButton from "../Components/FollowButton";
import ChatButton from "../Components/ChatButton";

function Home() {
    const { user, setUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
            localStorage.setItem('token', token);
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('JWT Payload:', payload);
            setUser({
                id: payload.nameid || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                email: payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                username: payload.unique_name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
            });
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [setUser]);

    useEffect(() => {
        if (user) {
            fetchFeed();
            fetchRecommendations();
        } else {
            fetchPosts();
        }
    }, [user]);

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

    const fetchFeed = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/feed`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            } else {
                // Fallback to all posts if no following feed
                fetchPosts();
                return;
            }
        } catch (error) {
            console.error("Error fetching feed:", error);
            fetchPosts();
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendations = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/recommendations`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setRecommendedUsers(data);
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 animate-pulse"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent_50%)] animate-pulse"></div>
                
                <div className="relative max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 border px-4 py-2 rounded-full text-sm font-medium mb-6" style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}}>
                            <Star size={16} style={{color: 'var(--text-primary)'}} />
                            Welcome to GeekzKai Community
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
                            GeekzKai 👾
                        </h1>
                        <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{color: 'var(--text-primary)'}}>
                            Your ultimate space to discuss anime theories, share ideas, and connect with fellow otaku from around the world!
                        </p>
                        
                        {user ? (
                            <div className="flex justify-center gap-4">
                                <Link
                                    to="/create"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                >
                                    <MessageCircle size={20} />
                                    Create Post
                                </Link>
                                <Link
                                    to="/rooms"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                >
                                    <Users size={20} />
                                    Join Rooms
                                </Link>
                                <Link
                                    to="/search"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold border-2 border-purple-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white"
                                    style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                                >
                                    <TrendingUp size={20} />
                                    Explore
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold border-2 border-purple-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white"
                                    style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                                >
                                    Join Community
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-8 rounded-2xl shadow-lg border-2 border-purple-500/30 hover:border-purple-600 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2" style={{backgroundColor: 'var(--bg-secondary)'}}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-600">
                            <Users className="text-white" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>Active Community</h3>
                        <p style={{color: 'var(--text-secondary)'}}>Connect with passionate anime fans worldwide</p>
                    </div>
                    <div className="text-center p-8 rounded-2xl shadow-lg border-2 border-slate-500/30 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2" style={{backgroundColor: 'var(--bg-secondary)'}}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600">
                            <MessageCircle className="text-white" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>Rich Discussions</h3>
                        <p style={{color: 'var(--text-secondary)'}}>Dive deep into anime theories and analysis</p>
                    </div>
                    <div className="text-center p-8 rounded-2xl shadow-lg border-2 border-pink-500/30 hover:border-pink-600 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2" style={{backgroundColor: 'var(--bg-secondary)'}}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-pink-600 to-orange-600">
                            <TrendingUp className="text-white" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2" style={{color: 'var(--text-primary)'}}>Trending Content</h3>
                        <p style={{color: 'var(--text-secondary)'}}>Stay updated with the hottest anime topics</p>
                    </div>
                </div>
            </div>

            {user && (
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Feed */}
                        <div className="lg:col-span-3">
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="inline-block w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-2" style={{color: 'var(--text-secondary)'}}>Loading your feed...</p>
                                </div>
                            ) : posts.length > 0 ? (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6" style={{color: 'var(--text-primary)'}}>Your Feed</h2>
                                    <div className="space-y-6">
                                        {posts.map((post) => (
                                            <div key={post.id} className="rounded-xl shadow-lg border p-6" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                                        {post.user?.username?.[0]?.toUpperCase() || 'A'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold" style={{color: 'var(--text-primary)'}}>{post.user?.username || 'Anonymous'}</h4>
                                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{new Date(post.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <h3 className="font-semibold mb-2" style={{color: 'var(--text-primary)'}}>{post.question}</h3>
                                                <p className="mb-4" style={{color: 'var(--text-secondary)'}}>{post.description}</p>
                                                {post.user && (
                                                    <div className="flex gap-2">
                                                        <ChatButton userId={post.user.id} username={post.user.username} onChatOpen={(user) => console.log('Open chat with:', user)} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Users size={48} className="mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
                                    <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--text-primary)'}}>Your feed is empty</h3>
                                    <p className="mb-6" style={{color: 'var(--text-secondary)'}}>Follow some users to see their posts here</p>
                                    <Link 
                                        to="/search" 
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                    >
                                        <Users size={20} />
                                        Find People to Follow
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {recommendedUsers.length > 0 && (
                                <div className="rounded-xl shadow-lg border p-6 mb-6" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
                                    <h3 className="font-semibold mb-4 flex items-center gap-2" style={{color: 'var(--text-primary)'}}>
                                        <UserPlus size={20} />
                                        Suggested for you
                                    </h3>
                                    <div className="space-y-3">
                                        {recommendedUsers.map((suggestedUser) => (
                                            <div key={suggestedUser.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                                        {suggestedUser.username[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm" style={{color: 'var(--text-primary)'}}>{suggestedUser.username}</p>
                                                        <p className="text-xs" style={{color: 'var(--text-secondary)'}}>{suggestedUser.followersCount} followers</p>
                                                    </div>
                                                </div>
                                                <FollowButton userId={suggestedUser.id} username={suggestedUser.username} size="sm" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!user && posts.length > 0 && (
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
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                                            {post.user?.username?.[0]?.toUpperCase() || 'A'}
                                        </div>
                                        <span className="text-sm font-medium" style={{color: 'var(--text-primary)'}}>{post.user?.username || 'Anonymous'}</span>
                                    </div>
                                    <span className="text-xs" style={{color: 'var(--text-secondary)'}}>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                                {post.user && (
                                    <div className="flex gap-2">
                                        <FollowButton userId={post.user.id} username={post.user.username} />
                                        <ChatButton userId={post.user.id} username={post.user.username} onChatOpen={(user) => console.log('Open chat with:', user)} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link 
                            to="/search" 
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