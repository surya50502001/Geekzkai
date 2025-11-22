import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, Edit, Share2 } from "lucide-react";
import UpdateProfile from "../Components/UpdateProfile";

export default function Profile() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [fullUser, setFullUser] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://geekzkai.onrender.com";

    useEffect(() => {
        if (token) {
            fetch(`${API_BASE_URL}/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.ok ? res.json() : null)
                .then((data) => {
                    setFullUser(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-text-primary">Loading...</div>;
    if (!fullUser) return <div className="flex justify-center items-center h-screen text-text-primary">Unable to load profile</div>;

    return (
        <div className="w-full min-h-screen bg-[#0f0f11] text-white">
            {/* Header */}
            <div className="border-b border-[#1f1f23] bg-[#121214]">
                <div className="max-w-4xl mx-auto px-6 py-5 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold tracking-wide">Profile</h1>
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <LogOut size={22} />
                    </button>
                </div>
            </div>

            {/* Profile Body */}
            <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

                {/* Card */}
                <div className="bg-[#16161a] border border-[#1f1f23] rounded-lg p-6 shadow-lg">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-lg bg-[#1d1d21] flex items-center justify-center overflow-hidden border border-[#2a2a2f]">
                            {fullUser.profilePictureUrl ? (
                                <img src={fullUser.profilePictureUrl} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-medium text-gray-400">
                                    {fullUser.username.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-3 text-center md:text-left">

                            <h2 className="text-2xl font-bold">{fullUser.username}</h2>

                            {/* Stats */}
                            <div className="flex justify-center md:justify-start gap-10 pt-2">
                                {[
                                    ["Posts", fullUser.posts?.length || 0],
                                    ["Followers", fullUser.followersCount || 0],
                                    ["Following", fullUser.followingCount || 0],
                                ].map(([label, count]) => (
                                    <div key={label} className="text-center">
                                        <p className="text-lg font-semibold">{count}</p>
                                        <p className="text-sm text-gray-500">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Bio */}
                            {fullUser.bio && (
                                <p className="text-gray-400 text-sm pt-2">{fullUser.bio}</p>
                            )}

                            {/* Actions */}
                            <div className="flex justify-center md:justify-start gap-4 pt-4">
                                <button
                                    onClick={() => setIsUpdateModalOpen(true)}
                                    className="px-4 py-2 border border-[#2b2b31] rounded-md text-gray-300 hover:bg-[#1d1d21] hover:text-white transition"
                                >
                                    <Edit size={16} className="inline mr-2" />
                                    Edit Profile
                                </button>

                                <button
                                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                                    className="px-4 py-2 border border-[#2b2b31] rounded-md text-gray-300 hover:bg-[#1d1d21] hover:text-white transition"
                                >
                                    <Share2 size={16} className="inline mr-2" />
                                    Share
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="bg-[#16161a] border border-[#1f1f23] rounded-lg p-6 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Account Details</h3>

                    <div className="space-y-3 text-gray-300">
                        <p><span className="text-gray-500">Email:</span> {fullUser.email}</p>
                        <p><span className="text-gray-500">Member Since:</span> {new Date(fullUser.createdAt).toLocaleDateString()}</p>

                        {fullUser.isYoutuber && (
                            <span className="inline-block bg-red-600/20 text-red-400 px-3 py-1 rounded text-xs">
                                YouTuber
                            </span>
                        )}

                        {fullUser.isAdmin && (
                            <span className="inline-block bg-purple-600/20 text-purple-400 px-3 py-1 rounded text-xs">
                                Admin
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <UpdateProfile isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} />
        </div>

    );
}
