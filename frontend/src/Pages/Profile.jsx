import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, Edit, Share2, User, Calendar, Mail, Menu, X, Settings, Check, Camera, UserCheck } from "lucide-react";
import { useTheme } from "../Context/ThemeContext";

import API_BASE_URL from "../apiConfig";

export default function Profile() {
    const { user, logout, token } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [fullUser, setFullUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [showTour, setShowTour] = useState(false);
    const [tourData, setTourData] = useState({ isYoutuber: false, youtubeChannel: '' });


    const refreshUserData = async () => {
        if (token && user) {
            try {
                const response = await fetch(`${API_BASE_URL}/user/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFullUser(data);
                }
            } catch (error) {
                console.error('Error refreshing user data:', error);
            }
        }
    };

    // Check for tour parameter
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tourParam = urlParams.get('tour');
        if (tourParam === 'true') {
            setShowTour(true);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // Refresh user data when component mounts or user changes
    useEffect(() => {
        refreshUserData();
    }, [user?.id]);

    useEffect(() => {
        if (fullUser && !isEditing) {
            setEditData({
                username: fullUser.username || '',
                bio: fullUser.bio || '',
                profilePictureUrl: fullUser.profilePictureUrl || '',
                isYoutuber: fullUser.isYoutuber || false,
                YouTubeChannelLink: fullUser.YouTubeChannelLink || ''
            });
        }
    }, [fullUser, isEditing]);

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
            <div className="flex justify-center items-center h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{borderColor: 'var(--text-primary)', borderTopColor: 'transparent'}}></div>
                    <p style={{color: 'var(--text-secondary)'}}>Loading profile...</p>
                </div>
            </div>
        );
    }
    
    if (!fullUser) {
        return (
            <div className="flex justify-center items-center h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
                <div className="text-center">
                    <p className="mb-4" style={{color: 'var(--text-secondary)'}}>Unable to load profile</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-4 py-2 rounded-lg transition-colors hover:opacity-80"
                        style={{backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)'}}
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
            {/* Header */}
            <div className="border-b sticky top-0 z-20" style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)'}}>
                <div className="px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-semibold" style={{color: 'var(--text-primary)'}}>{fullUser.username}</h1>
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 rounded-lg transition-colors hover:opacity-80"
                        style={{color: 'var(--text-primary)'}}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Hamburger Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50" style={{backgroundColor: 'var(--bg-primary)'}}>
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b" style={{borderColor: 'var(--border-color)'}}>
                            <h2 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>Account</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 rounded-lg transition-colors"
                                style={{color: 'var(--text-primary)'}}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 p-4 space-y-6">
                            {/* User Info */}
                            <div className="p-6 border-b" style={{borderColor: 'var(--border-color)'}}>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden" style={{backgroundColor: 'var(--bg-secondary)'}}>
                                        {fullUser.profilePictureUrl ? (
                                            <img src={fullUser.profilePictureUrl} className="w-full h-full object-cover" alt="Profile" />
                                        ) : (
                                            <User size={32} style={{color: 'var(--text-secondary)'}} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>{fullUser.username}</h3>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{fullUser.email}</p>
                                        <p className="text-xs" style={{color: 'var(--text-secondary)'}}>Member since {new Date(fullUser.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Menu Items */}
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-4 p-4 rounded-lg transition-colors hover:opacity-80"
                                    style={{color: 'var(--text-primary)'}}
                                >
                                    <Edit size={20} />
                                    <span>Edit Profile</span>
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/follow-requests');
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-4 p-4 rounded-lg transition-colors hover:opacity-80"
                                    style={{color: 'var(--text-primary)'}}
                                >
                                    <UserCheck size={20} />
                                    <span>Follow Requests</span>
                                </button>
                                <button
                                    onClick={() => {
                                        toggleTheme();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-4 p-4 rounded-lg transition-colors hover:opacity-80"
                                    style={{color: 'var(--text-primary)'}}
                                >
                                    <span className="text-xl">{isDark ? '☀️' : '🌙'}</span>
                                    <span>Theme: {isDark ? 'Dark' : 'Light'}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/settings');
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-4 p-4 rounded-lg transition-colors hover:opacity-80"
                                    style={{color: 'var(--text-primary)'}}
                                >
                                    <Settings size={20} />
                                    <span>Settings</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 p-4 rounded-lg transition-colors hover:opacity-80"
                                    style={{color: 'var(--text-primary)'}}
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
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
                    <div className="relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center overflow-hidden" style={{backgroundColor: 'var(--bg-secondary)'}}>
                            {fullUser.profilePictureUrl ? (
                                <img src={fullUser.profilePictureUrl} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <User size={32} style={{color: 'var(--text-secondary)'}} />
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer" style={{backgroundColor: '#3b82f6'}}>
                                <Camera size={16} color="white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (e) => {
                                                setEditData({...editData, profilePictureUrl: e.target.result});
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex-1">
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>{posts.length}</p>
                                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Posts</p>
                            </div>
                            <button 
                                onClick={() => navigate(`/user/${fullUser.id}/followers`)}
                                className="p-2 rounded-lg transition-colors hover:opacity-80"
                            >
                                <p className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>{fullUser.followersCount || 0}</p>
                                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Followers</p>
                            </button>
                            <button 
                                onClick={() => navigate(`/user/${fullUser.id}/following`)}
                                className="p-2 rounded-lg transition-colors hover:opacity-80"
                            >
                                <p className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>{fullUser.followingCount || 0}</p>
                                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Following</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                    {isEditing ? (
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={editData.username}
                                onChange={(e) => setEditData({...editData, username: e.target.value})}
                                className="w-full p-2 border rounded-lg font-semibold"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                            <textarea
                                value={editData.bio}
                                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                                placeholder="Tell us about yourself..."
                                rows={3}
                                maxLength={200}
                                className="w-full p-2 border rounded-lg text-sm resize-none"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                            <p className="text-xs" style={{color: 'var(--text-secondary)'}}>{editData.bio.length}/200</p>
                            
                            <div className="flex items-center justify-between p-3 rounded-lg border" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
                                <span style={{color: 'var(--text-primary)'}}>Are you a YouTuber?</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editData.isYoutuber}
                                        onChange={(e) => setEditData({...editData, isYoutuber: e.target.checked})}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            
                            {editData.isYoutuber && (
                                <input
                                    type="url"
                                    value={editData.YouTubeChannelLink}
                                    onChange={(e) => setEditData({...editData, YouTubeChannelLink: e.target.value})}
                                    placeholder="https://youtube.com/@yourchannel"
                                    className="w-full p-2 border rounded-lg text-sm"
                                    style={{
                                        backgroundColor: 'var(--bg-secondary)',
                                        borderColor: 'var(--border-color)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <>
                            <h2 className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>{fullUser.username}</h2>
                            {fullUser.bio && (
                                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{fullUser.bio}</p>
                            )}
                        </>
                    )}
                    
                    {/* Badges */}
                    <div className="flex gap-2 mt-2">
                        {fullUser.isYoutuber && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                YouTuber
                            </span>
                        )}
                        {fullUser.isAdmin && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                Admin
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-8">
                    {isEditing ? (
                        <>
                            <button
                                onClick={async () => {
                                    setSaving(true);
                                    setSaveMessage('');
                                    try {
                                        console.log('Saving to:', `${API_BASE_URL}/user/me`);
                                        console.log('Data:', editData);
                                        const response = await fetch(`${API_BASE_URL}/user/me`, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${token}`
                                            },
                                            body: JSON.stringify(editData)
                                        });
                                        
                                        console.log('Response status:', response.status);
                                        
                                        if (response.ok) {
                                            const updatedUser = await response.json();
                                            setFullUser(updatedUser);
                                            setIsEditing(false);
                                            setSaveMessage('Profile updated successfully!');
                                        } else {
                                            const errorText = await response.text();
                                            console.error('Server error:', errorText);
                                            setSaveMessage(`Failed to save: ${response.status} ${response.statusText}`);
                                        }
                                    } catch (error) {
                                        console.error('Update failed:', error);
                                        setSaveMessage(`Network error: ${error.message}`);
                                    } finally {
                                        setSaving(false);
                                    }
                                }}
                                disabled={saving}
                                className="flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors hover:opacity-80 disabled:opacity-50"
                                style={{backgroundColor: '#3b82f6', color: 'white'}}
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors hover:opacity-80"
                                style={{backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors hover:opacity-80"
                                style={{backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}}
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={() => navigator.clipboard.writeText(window.location.href)}
                                className="flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors hover:opacity-80"
                                style={{backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}}
                            >
                                Share Profile
                            </button>
                        </>
                    )}
                    
                    {/* Save Message */}
                    {saveMessage && (
                        <div className={`mt-3 p-2 rounded text-sm text-center ${saveMessage.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {saveMessage}
                        </div>
                    )}
                </div>

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
                            <p className="mb-4" style={{color: 'var(--text-secondary)'}}>No posts yet</p>
                            <button
                                onClick={() => navigate('/create')}
                                className="px-6 py-2 rounded-lg transition-colors hover:opacity-80"
                                style={{backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)'}}
                            >
                                Share your first post
                            </button>
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


            {/* Tour Modal */}
            {showTour && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="w-full max-w-md rounded-lg p-6" style={{backgroundColor: 'var(--bg-primary)'}}>
                        <h2 className="text-xl font-bold mb-4" style={{color: 'var(--text-primary)'}}>Welcome to GeekzKai!</h2>
                        <p className="mb-4" style={{color: 'var(--text-secondary)'}}>Are you a YouTuber?</p>
                        
                        <div className="space-y-3 mb-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="youtuber"
                                    checked={!tourData.isYoutuber}
                                    onChange={() => setTourData({...tourData, isYoutuber: false})}
                                    className="w-4 h-4"
                                />
                                <span style={{color: 'var(--text-primary)'}}>No, I'm just here to explore</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="youtuber"
                                    checked={tourData.isYoutuber}
                                    onChange={() => setTourData({...tourData, isYoutuber: true})}
                                    className="w-4 h-4"
                                />
                                <span style={{color: 'var(--text-primary)'}}>Yes, I'm a YouTuber</span>
                            </label>
                        </div>
                        
                        {tourData.isYoutuber && (
                            <input
                                type="url"
                                placeholder="YouTube Channel URL (optional)"
                                value={tourData.youtubeChannel}
                                onChange={(e) => setTourData({...tourData, youtubeChannel: e.target.value})}
                                className="w-full p-2 mb-4 border rounded-lg"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        )}
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowTour(false)}
                                className="flex-1 py-2 px-4 rounded-lg"
                                style={{backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}}
                            >
                                Skip
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await fetch(`${API_BASE_URL}/user/me`, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${token}`
                                            },
                                            body: JSON.stringify({
                                                isYoutuber: tourData.isYoutuber,
                                                youtubeChannelLink: tourData.youtubeChannel
                                            })
                                        });
                                        setShowTour(false);
                                        refreshUserData();
                                    } catch (error) {
                                        console.error('Failed to update:', error);
                                    }
                                }}
                                className="flex-1 py-2 px-4 rounded-lg"
                                style={{backgroundColor: '#3b82f6', color: 'white'}}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}