import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, Edit, Share2, User, Calendar, Mail, Menu, X, Settings } from "lucide-react";
import UpdateProfile from "../Components/UpdateProfile";

export default function Profile() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [fullUser, setFullUser] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://geekzkai.onrender.com/api";

    useEffect(() => {
        if (token && user) {
            fetch(`${API_BASE_URL}/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch user');
                    return res.json();
                })
                .then((data) => {
                    setFullUser(data);
                    return fetch(`${API_BASE_URL}/posts`);
                })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch posts');
                    return res.json();
                })
                .then(allPosts => {
                    const myPosts = allPosts.filter(p => p.userId === user.id);
                    setPosts(myPosts);
                })
                .catch((error) => {
                    console.error('Profile fetch error:', error);
                })
                .finally(() => setLoading(false));
        } else if (!token) {
            navigate('/login');
        } else {
            setLoading(false);
        }
    }, [token, user, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }
    
    if (!fullUser) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Unable to load profile</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-yellow-50 dark:bg-purple-900">
            {/* Header */}
            <div className="bg-white dark:bg-purple-800 border-b border-yellow-200 dark:border-purple-700 sticky top-0 z-20">
                <div className="px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{fullUser.username}</h1>
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Hamburger Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMenuOpen(false)}>
                    <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 space-y-6">
                            {/* Account Details */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Account Details</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Mail size={16} className="text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="text-sm text-gray-900 dark:text-white">{fullUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar size={16} className="text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                                            <p className="text-sm text-gray-900 dark:text-white">{new Date(fullUser.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        setIsUpdateModalOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <Edit size={16} />
                                    Edit Profile
                                </button>
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <Settings size={16} />
                                    Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-4 py-6">
                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-8">
                    {/* Avatar */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {fullUser.profilePictureUrl ? (
                            <img src={fullUser.profilePictureUrl} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <User size={32} className="text-gray-400" />
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex-1">
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{posts.length}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{fullUser.followersCount || 0}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{fullUser.followingCount || 0}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-1">{fullUser.username}</h2>
                    {fullUser.bio && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{fullUser.bio}</p>
                    )}
                    
                    {/* Badges */}
                    <div className="flex gap-2 mt-2">
                        {fullUser.isYoutuber && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                YouTuber
                            </span>
                        )}
                        {fullUser.isAdmin && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                Admin
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setIsUpdateModalOpen(true)}
                        className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                        Share Profile
                    </button>
                </div>

                {/* Posts Grid */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                    <div className="flex justify-center mb-4">
                        <div className="w-6 h-6 border-2 border-gray-900 dark:border-white grid grid-cols-3 gap-0.5">
                            <div className="bg-gray-900 dark:bg-white"></div>
                            <div className="bg-gray-900 dark:bg-white"></div>
                            <div className="bg-gray-900 dark:bg-white"></div>
                            <div className="bg-gray-900 dark:bg-white"></div>
                            <div className="bg-gray-900 dark:bg-white"></div>
                            <div className="bg-gray-900 dark:bg-white"></div>
                            <div className="bg-gray-900 dark:bg-white"></div>
                            <div className="bg-gray-900 dark:bg-white"></div>
                            <div className="bg-gray-900 dark:bg-white"></div>
                        </div>
                    </div>
                    {posts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                                <User size={24} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No posts yet</p>
                            <button
                                onClick={() => navigate('/create')}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Share your first post
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-1">
                            {posts.map((post) => (
                                <div key={post.id} className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative group cursor-pointer">
                                    <div className="text-center p-2">
                                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-2">{post.question}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="text-white text-xs text-center">
                                            <p>{post.comments?.length || 0} comments</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <UpdateProfile isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} />
        </div>
    );
}