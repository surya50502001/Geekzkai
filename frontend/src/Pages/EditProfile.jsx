import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import API_BASE_URL from '../apiConfig';

export default function EditProfile() {
    const navigate = useNavigate();
    const { user, token, setUser } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        profilePictureUrl: '',
        isYoutuber: false,
        YouTubeChannelLink: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || '',
                profilePictureUrl: user.profilePictureUrl || '',
                isYoutuber: user.isYoutuber || false,
                YouTubeChannelLink: user.YouTubeChannelLink || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData({
                    ...formData,
                    profilePictureUrl: e.target.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/user/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setMessage('Profile updated successfully!');
                setTimeout(() => navigate('/profile'), 1500);
            } else {
                const error = await response.json();
                setMessage(error.message || 'Failed to update profile');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
            {/* Header */}
            <div className="sticky top-0 z-10 p-4 border-b flex items-center gap-4" style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)'}}>
                <button onClick={() => navigate(-1)} className="p-2 rounded-lg" style={{color: 'var(--text-primary)'}}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>Edit Profile</h1>
            </div>

            <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden" style={{backgroundColor: 'var(--bg-secondary)'}}>
                                {formData.profilePictureUrl ? (
                                    <img src={formData.profilePictureUrl} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    <User size={32} style={{color: 'var(--text-secondary)'}} />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer" style={{backgroundColor: '#3b82f6'}}>
                                <Camera size={16} color="white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-sm mt-2" style={{color: 'var(--text-secondary)'}}>Tap to change photo</p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={3}
                                maxLength={200}
                                className="w-full p-3 border rounded-lg resize-none"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                                placeholder="Tell us about yourself..."
                            />
                            <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>{formData.bio.length}/200</p>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
                            <span style={{color: 'var(--text-primary)'}}>Are you a YouTuber?</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isYoutuber}
                                    onChange={(e) => setFormData({...formData, isYoutuber: e.target.checked})}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {formData.isYoutuber && (
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-primary)'}}>YouTube Channel Link</label>
                                <input
                                    type="url"
                                    name="YouTubeChannelLink"
                                    value={formData.YouTubeChannelLink}
                                    onChange={handleInputChange}
                                    placeholder="https://youtube.com/@yourchannel"
                                    className="w-full p-3 border rounded-lg"
                                    style={{
                                        backgroundColor: 'var(--bg-secondary)',
                                        borderColor: 'var(--border-color)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                        style={{backgroundColor: '#3b82f6', color: 'white'}}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>

                    {/* Message */}
                    {message && (
                        <div className={`p-3 rounded-lg text-center ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}