import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Send, Image, Smile } from "lucide-react";
import API_BASE_URL from "../apiConfig";

export default function CreatePostInline({ onPostCreated }) {
    const { token, user } = useAuth();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        
        setLoading(true);

        const payload = {
            question: title,
            description: content,
            userId: user.id
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
                setTitle("");
                setContent("");
                setExpanded(false);
                if (onPostCreated) onPostCreated();
            }
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="rounded-xl shadow-lg border p-4 mb-6" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
            <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onFocus={() => setExpanded(true)}
                            placeholder="What's on your mind about anime?"
                            className="w-full p-3 rounded-lg border-none outline-none resize-none text-lg"
                            style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                        />
                        
                        {expanded && (
                            <>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Share your thoughts, theories, or questions..."
                                    className="w-full p-3 rounded-lg border-none outline-none resize-none"
                                    style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                                    rows={3}
                                />
                                
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex gap-3">
                                        <button type="button" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <Image size={20} style={{color: 'var(--text-secondary)'}} />
                                        </button>
                                        <button type="button" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <Smile size={20} style={{color: 'var(--text-secondary)'}} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setExpanded(false);
                                                setTitle("");
                                                setContent("");
                                            }}
                                            className="px-4 py-2 rounded-full font-medium transition-colors"
                                            style={{color: 'var(--text-secondary)'}}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading || !title.trim() || !content.trim()}
                                            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                                        >
                                            {loading ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Send size={16} />
                                            )}
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}