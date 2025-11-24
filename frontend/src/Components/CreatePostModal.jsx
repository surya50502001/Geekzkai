import { X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

export default function CreatePostModal({ isOpen, onClose }) {
    const { token, user } = useAuth();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://geekzkai.onrender.com/api";

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            question: title,
            description: content,
            userId: user.id   // 👈 dynamic from logged-in user
        };

        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Post created successfully!");
                onClose();
                window.location.reload();
            } else {
                alert("Failed to create post");
            }
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && onClose()}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
        >
            <div className="bg-background-secondary w-full max-w-md rounded-xl shadow-xl p-6 relative">
                <button onClick={onClose} className="absolute right-3 top-3">
                    <X size={22} />
                </button>

                <h2 className="text-xl font-bold mb-4">Create a New Post</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post Title"
                        className="w-full p-2 border rounded mb-4"
                        required
                    />

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Description"
                        className="w-full p-2 border rounded mb-4"
                        rows={4}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded w-full"
                    >
                        {loading ? "Creating..." : "Create Post"}
                    </button>
                </form>
            </div>
        </div>
    );
}
