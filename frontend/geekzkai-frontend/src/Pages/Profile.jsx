import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, Edit, Share2 } from "lucide-react";
import UpdateProfile from "../Components/UpdateProfile";

function Profile() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [fullUser, setFullUser] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5131/api";

    useEffect(() => {
        if (token) {
            fetch(`${API_BASE_URL}/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.ok ? res.json() : null)
                .then((data) => {
                    setFullUser(data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token, API_BASE_URL]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-text-primary">Loading...</div>;
    }

    if (!fullUser) {
        return <div className="flex justify-center items-center h-screen text-text-primary">Unable to load profile</div>;
    }

    return (
        <div className="w-full min-h-screen bg-background-primary text-text-primary">
            {/* Header */}
            <div className="bg-background-secondary shadow-sm border-b border-border-primary">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <button onClick={handleLogout} className="text-text-secondary hover:text-primary transition-colors">
                        <LogOut size={24} />
                    </button>
                </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-background-secondary rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        {/* Profile Picture */}
                        <div className="w-32 h-32 rounded-full bg-background-tertiary flex items-center justify-center overflow-hidden">
                            {fullUser.profilePictureUrl ? (
                                <img
                                    src={fullUser.profilePictureUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-4xl text-text-secondary">
                                    {fullUser.username?.charAt(0).toUpperCase() || "?"}
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold mb-2">
                                {fullUser.username}
                            </h2>

                            {/* Stats */}
                            <div className="flex justify-center md:justify-start space-x-6 mb-4">
                                <div className="text-center">
                                    <div className="font-bold text-lg">{fullUser.posts?.length || 0}</div>
                                    <div className="text-text-secondary text-sm">Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-lg">{fullUser.followersCount || 0}</div>
                                    <div className="text-text-secondary text-sm">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-lg">{fullUser.followingCount || 0}</div>
                                    <div className="text-text-secondary text-sm">Following</div>
                                </div>
                            </div>

                            {/* Bio */}
                            {fullUser.bio && (
                                <p className="text-text-secondary mb-3">{fullUser.bio}</p>
                            )}

                            {/* YouTube Link */}
                            {fullUser.youTubeChannellink && (
                                <a
                                    href={fullUser.youTubeChannellink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a2.997 2.997 0 0 0-2.11-2.11C19.568 3.5 12 3.5 12 3.5s-7.568 0-9.388.576A2.997 2.997 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.997 2.997 0 0 0 2.11 2.11c1.82.576 9.388.576 9.388.576s7.568 0 9.388-.576a2.997 2.997 0 0 0 2.11-2.11C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.75 15.02V8.98l6.5 3.02-6.5 3.02z"/>
                                    </svg>
                                    YouTube Channel
                                </a>
                            )}
                            <div className="flex justify-center md:justify-start space-x-4 mt-4">
                                <button onClick={() => setIsUpdateModalOpen(true)} className="flex items-center gap-2 border border-border-primary p-2 rounded-lg text-text-secondary hover:bg-background-tertiary hover:text-primary transition-colors">
                                    <Edit size={18} />
                                    <span>Edit Profile</span>
                                </button>
                                <button onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Profile link copied to clipboard!'))} className="flex items-center gap-2 border border-border-primary p-2 rounded-lg text-text-secondary hover:bg-background-tertiary hover:text-primary transition-colors">
                                    <Share2 size={18} />
                                    <span>Share Profile</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-background-secondary rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                    <div className="space-y-3">
                        <div>
                            <span className="font-medium text-text-secondary">Email:</span> {fullUser.email}
                        </div>
                        <div>
                            <span className="font-medium text-text-secondary">Member since:</span>{" "}
                            {new Date(fullUser.createdAt).toLocaleDateString()}
                        </div>
                        {fullUser.isYoutuber && (
                            <div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    YouTuber
                                </span>
                            </div>
                        )}
                        {fullUser.isAdmin && (
                            <div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Admin
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <UpdateProfile isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} />
        </div>
    );
}

export default Profile;
