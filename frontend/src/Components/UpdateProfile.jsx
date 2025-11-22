import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5131/api";

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
            className="fixed top-0 left-0 right-0 bottom-0 bg-white bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
        >
            <div className="bg-background-secondary w-80 rounded-xl shadow-xl p-6 relative animate-fadeIn border border-border-primary">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold mb-4 text-text-primary">Update Profile</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-3 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="password"
                        placeholder="New Password (optional)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 bg-background-primary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button type="submit" disabled={loading} className="p-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:bg-gray-400">
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
