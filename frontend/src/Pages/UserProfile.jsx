import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import API_BASE_URL from '../apiConfig';
import FollowButton from '../Components/FollowButton';
import ChatButton from '../Components/ChatButton';

export default function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchUser();
        fetchUserPosts();
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/${id}`);
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts`);
            if (response.ok) {
                const allPosts = await response.json();
                const userPosts = allPosts.filter(post => post.userId === parseInt(id));
                setPosts(userPosts);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{borderColor: 'var(--text-primary)'}}></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
                <p style={{color: 'var(--text-secondary)'}}>User not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
            {/* Header */}
            <div className="border-b sticky top-0 z-20" style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)'}}>
                <div className="px-4 py-3 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-lg" style={{color: 'var(--text-primary)'}}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-semibold" style={{color: 'var(--text-primary)'}}>{user.username}</h1>
                </div>
            </div>

            <div className="px-4 py-6">
                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center overflow-hidden" style={{backgroundColor: 'var(--bg-secondary)'}}>
                        {user.profilePictureUrl ? (
                            <img src={user.profilePictureUrl} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <User size={32} style={{color: 'var(--text-secondary)'}} />
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>{posts.length}</p>
                                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Posts</p>
                            </div>
                            <button onClick={() => navigate(`/user/${user.id}/followers`)} className="p-2 rounded-lg">
                                <p className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>{user.followersCount || 0}</p>
                                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Followers</p>
                            </button>
                            <button onClick={() => navigate(`/user/${user.id}/following`)} className="p-2 rounded-lg">
                                <p className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>{user.followingCount || 0}</p>
                                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Following</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                    <h2 className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>{user.username}</h2>
                    {user.bio && (
                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{user.bio}</p>
                    )}
                    
                    <div className="flex gap-2 mt-2">
                        {user.isYoutuber && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                YouTuber
                            </span>
                        )}
                        {user.isAdmin && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                Admin
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                {currentUser && currentUser.id !== user.id && (
                    <div className="flex gap-3 mb-8">
                        <FollowButton userId={user.id} username={user.username} onFollowChange={fetchUser} />
                        <ChatButton userId={user.id} username={user.username} onChatOpen={(userInfo) => navigate('/chat', { state: { selectedUser: userInfo } })} />
                    </div>
                )}

                {/* Posts Grid */}
                <div className="border-t pt-4" style={{borderColor: 'var(--border-color)'}}>
                    <div className="flex justify-center mb-4">
                        <div className="w-6 h-6 border-2 grid grid-cols-3 gap-0.5" style={{borderColor: 'var(--text-primary)'}}>
                            <div style={{backgroundColor: 'var(--text-primary)'}}></div>
                            <div style={{backgroundColor: 'var(--text-primary)'}}></div>
                            <div style={{backgroundColor: 'var(--text-primary)'}}></div>
                            <div style={{backgroundColor: 'var(--text-primary)'}}></div>
                            <div style={{backgroundColor: 'var(--text-primary)'}}></div>
                            <div style={{backgroundColor: 'var(--text-primary)'}}></div>
                            <div style={{backgroundColor: 'var(--text-primary)'}}></div>
                            <div style={{backgroundColor: 'var(--text-primary)'}}></div>
                            <div style={{backgroundColor: 'var(--text-primary)'}}></div>
                        </div>
                    </div>
                    {posts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 border-2 rounded-full flex items-center justify-center" style={{borderColor: 'var(--border-color)'}}>
                                <User size={24} style={{color: 'var(--text-secondary)'}} />
                            </div>
                            <p style={{color: 'var(--text-secondary)'}}>No posts yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-1">
                            {posts.map((post) => (
                                <div 
                                    key={post.id} 
                                    onClick={() => navigate(`/post/${post.id}`)}
                                    className="aspect-square flex items-center justify-center relative group cursor-pointer" 
                                    style={{backgroundColor: 'var(--bg-secondary)'}}
                                >
                                    <div className="text-center p-2">
                                        <p className="text-xs font-medium line-clamp-2" style={{color: 'var(--text-primary)'}}>{post.question}</p>
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
        </div>
    );
}