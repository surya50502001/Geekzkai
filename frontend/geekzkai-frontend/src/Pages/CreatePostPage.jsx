import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

export default function CreatePostPage() {
    const { token } = useAuth();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (image) formData.append("image", image);

        try {
            const response = await fetch("http://localhost:5000/api/posts", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                alert("Post created successfully!");
                setTitle("");
                setContent("");
                setImage(null);
                // Optionally redirect to home or posts page
            } else {
                alert("Failed to create post");
            }
        } catch (error) {
            console.error("Error creating post:", error);
            alert("An error occurred while creating the post");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="text-text-primary px-6 py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">Create a New Post</h1>
                <div className="bg-bg-secondary p-6 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-text-primary mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-border rounded bg-bg-primary text-text-primary"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-text-primary mb-2">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-2 border border-border rounded bg-bg-primary text-text-primary"
                                rows="4"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-text-primary mb-2">Image (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-2 border border-border rounded bg-bg-primary text-text-primary"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "Create Post"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
