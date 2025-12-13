import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://geekzkai.onrender.com/api";

function UpdateProfile({ isOpen, onClose }) {
    const { user, token } = useAuth();
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_BASE_URL}/user/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: user.id,
                username,
                email,
                passwordHash: password,
            }),
        });

        if (res.ok) {
            setMessage("Profile updated successfully");
        } else {
            const errorData = await res.json();
            setMessage(errorData.message || "Failed to update profile");
        }
    };

    return (
        <div
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <div className="w-full max-w-md rounded-lg shadow-xl p-6 relative" style={{backgroundColor: 'var(--bg-secondary)'}}>
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 p-2 rounded-lg transition-colors"
                    style={{color: 'var(--text-primary)'}}
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-6" style={{color: 'var(--text-primary)'}}>Update Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="New Password (optional)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full p-3 rounded-lg transition-colors disabled:opacity-50"
                        style={{backgroundColor: '#3b82f6', color: 'white'}}
                    >
                        {loading ? "Updating..." : "Update"}
                    </button>
                </form>
                {message && (
                    <p className={`mt-4 text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default UpdateProfile;
