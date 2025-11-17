import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5131/api";

function UpdateProfile() {
    const { user, token } = useAuth();
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

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
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 rounded-lg bg-background-secondary"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 rounded-lg bg-background-secondary"
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 rounded-lg bg-background-secondary"
                />
                <button type="submit" className="p-2 rounded-lg bg-accent-primary text-white">
                    Update
                </button>
            </form>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}

export default UpdateProfile;
