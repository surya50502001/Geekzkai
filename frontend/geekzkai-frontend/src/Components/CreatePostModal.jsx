import { X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

export default function CreatePostModal({ isOpen, onClose }) {
    const { token } = useAuth();
    const [content, setContent] = useState("");
    const [anime, setAnime] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5131/api";

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch(`${API_BASE_URL}/post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    question: content,
                    anime: anime,
                    userId: null, // Assuming userId is set on backend from token
                }),
            });

            if (res.ok) {
                setMessage("Post created successfully!");
                setContent("");
                setAnime("");
                onClose();
            } else {
                const errorData = await res.json();
                setMessage(errorData.message || "Failed to create post");
            }
        } catch (error) {
            setMessage("An error occurred while creating the post");
        } finally {
            setLoading(false);
        }
    };

    // ✨ Close when clicking outside the box
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleOverlayClick}   // ⭐ listen for outside clicks
            className="fixed top-16 left-0 right-0 bottom-0 bg-white bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
        >
            <div className="bg-background-secondary w-80 rounded-xl shadow-xl p-6 relative animate-fadeIn border border-border-primary">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                >
                    <X size={22} />
                </button>

                <h2 className="text-xl font-bold mb-4 text-text-primary">Create Post</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Content input */}
                    <textarea
                        className="border border-border-primary bg-background-primary p-3 rounded-md h-28 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Write your theory..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {/* Anime dropdown */}
                    <select
                        className="border border-border-primary bg-background-primary p-2 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        value={anime}
                        onChange={(e) => setAnime(e.target.value)}
                        required
                    >
                        <option value="">Select Anime</option>
                        <option value="Naruto">Naruto</option>
                        <option value="One Piece">One Piece</option>
                        <option value="Jujutsu Kaisen">JJK</option>
                        <option value="Attack On Titan">AOT</option>
                    </select>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading || content.length < 3 || !anime}
                        className={`p-2 rounded-md text-white transition-all ${
                            loading || content.length < 3 || !anime ? "bg-gray-400" : "bg-primary hover:bg-primary-dark"
                        }`}
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>

                    {message && (
                        <div className={`mt-4 p-2 rounded-md ${message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {message}
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
}
