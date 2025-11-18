import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import CreatePostModal from "../Components/CreatePostModal";

function Profile() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [fullUser, setFullUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

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

  

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!fullUser) {
        return <div className="flex justify-center items-center h-screen">Unable to load profile</div>;
    }

    return (

       
        <div className="w-full min-h-screen bg-gray-50">
            {/* Profile Header stuff here */}

            {/* Floating + button (Instagram style) */}
            <button
                onClick={() => setOpenModal(true)}
                className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all"
            >
                <Plus size={28} />
            </button>

            {/* Modal Component */}
            {openModal && <CreatePostModal closeModal={() => setOpenModal(false)} />}
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Profile</h1>                   
                </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        {/* Profile Picture */}
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {fullUser.profilePictureUrl ? (
                                <img
                                    src={fullUser.profilePictureUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-4xl text-gray-400">
                                    {fullUser.username?.charAt(0).toUpperCase() || "?"}
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {fullUser.username}
                            </h2>

                            {/* Stats */}
                            <div className="flex justify-center md:justify-start space-x-6 mb-4">
                                <div className="text-center">
                                    <div className="font-bold text-lg">{fullUser.posts?.length || 0}</div>
                                    <div className="text-gray-600 text-sm">Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-lg">{fullUser.followersCount || 0}</div>
                                    <div className="text-gray-600 text-sm">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-lg">{fullUser.followingCount || 0}</div>
                                    <div className="text-gray-600 text-sm">Following</div>
                                </div>
                            </div>

                            {/* Bio */}
                            {fullUser.bio && (
                                <p className="text-gray-700 mb-3">{fullUser.bio}</p>
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
                            <div className="flex space-x-6">
                                <div className="border border-yellow-500 p-1">Edit Profile</div>
                                <div className="border border-yellow-500 p-1">Share Profile</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>
                    <div className="space-y-3">
                        <div>
                            <span className="font-medium text-gray-600">Email:</span> {fullUser.email}
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Member since:</span>{" "}
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
        </div>
    );
}

export default Profile;
