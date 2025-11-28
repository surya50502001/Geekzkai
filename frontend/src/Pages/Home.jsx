﻿import { useTheme } from "../Context/ThemeContext";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

function Home() {
    const { theme } = useTheme();
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
            const response = await fetch("/api/posts", {
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
                window.location.reload();
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
                <h1 className="text-4xl font-bold mb-4">Welcome to GeekzKai 👾</h1>
                <p className="text-text-secondary text-lg mb-8">
                    Your space to discuss anime theories, post “what if” ideas, and vibe with other fans!
                </p>
                <p className="mt-4 mb-6">Current theme: <span className="font-semibold text-primary">{theme}</span></p>

            </div>
        </div>
    );
}

export default Home;
