import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, MessageCircle } from 'lucide-react';
import API_BASE_URL from '../apiConfig';
import FollowButton from '../Components/FollowButton';
import ChatButton from '../Components/ChatButton';
import FollowersModal from '../Components/FollowersModal';

export default function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [followersModalOpen, setFollowersModalOpen] = useState(false);
    const [followingModalOpen, setFollowingModalOpen] = useState(false);

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/${id}`);
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setError('User not found');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setError('Failed to load user profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--bg-primary)'}}>
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p style={{color: 'var(--text-secondary)'}}>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--bg-primary)'}}>
                <div className="text-center">
                    <p className="mb-4" style={{color: 'var(--text-secondary)'}}>{error || 'User not found'}</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 rounded-lg transition-colors"
                        style={{backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
            {/* Header */}
            <div className="border-b sticky top-0 z-20" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
                <div className="px-4 py-3 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg transition-colors hover:opacity-80"
                        style={{color: 'var(--text-primary)', backgroundColor: 'var(--bg-primary)'}}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-semibold" style={{color: 'var(--text-primary)'}}>{user.username}</h1>
                </div>
            </div>

            <div className="px-4 py-6">
                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-8">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden" style={{backgroundColor: 'var(--bg-secondary)'}}>
                        {user.profilePictureUrl ? (
                            <img src={user.profilePictureUrl} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <User size={32} style={{color: 'var(--text-secondary)'}} />
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex-1">
                        <div className="flex justify-around text-center">
                            <button 
                                onClick={() => setFollowersModalOpen(true)}
                                className="p-2 rounded-lg transition-colors hover:opacity-80"
                                style={{backgroundColor: 'var(--bg-secondary)'}}
                            >
                                <p className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>{user.followersCount || 0}</p>
                                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Followers</p>
                            </button>
                            <button 
                                onClick={() => setFollowingModalOpen(true)}
                                className="p-2 rounded-lg transition-colors hover:opacity-80"
                                style={{backgroundColor: 'var(--bg-secondary)'}}
                            >
                                <p className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>{user.followingCount || 0}</p>
                                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Following</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="mb-6">
                    <h2 className="font-semibold mb-2 text-xl" style={{color: 'var(--text-primary)'}}>{user.username}</h2>
                    
                    {user.bio && (
                        <p className="mb-4" style={{color: 'var(--text-secondary)'}}>{user.bio}</p>
                    )}
                    
                    {/* Member Since */}
                    <div className="flex items-center gap-2 text-sm mb-4" style={{color: 'var(--text-secondary)'}}>
                        <Calendar size={16} />
                        <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex gap-2 mb-6">
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
                <div className="flex gap-3">
                    <div className="flex-1">
                        <FollowButton userId={user.id} username={user.username} />
                    </div>
                    <div className="flex-1">
                        <ChatButton 
                            userId={user.id} 
                            username={user.username} 
                            onChatOpen={(user) => console.log('Open chat with:', user)} 
                        />
                    </div>
                </div>
            </div>
            
            <FollowersModal 
                isOpen={followersModalOpen}
                onClose={() => setFollowersModalOpen(false)}
                userId={user?.id}
                type="followers"
                username={user?.username}
            />
            
            <FollowersModal 
                isOpen={followingModalOpen}
                onClose={() => setFollowingModalOpen(false)}
                userId={user?.id}
                type="following"
                username={user?.username}
            />
        </div>
    );
}