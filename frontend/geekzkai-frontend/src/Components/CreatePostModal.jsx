import { X } from "lucide-react";
import { useState } from "react";

export default function CreatePostModal({ closeModal }) {
    const [content, setContent] = useState("");
    const [anime, setAnime] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const postData = { content, anime, imageUrl: null };

        console.log("Post Created:", postData);
        closeModal();
    };

    // ✨ Close when clicking outside the box
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div
            onClick={handleOverlayClick}   // ⭐ listen for outside clicks
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
        >
            <div className="bg-white w-80 rounded-xl shadow-xl p-6 relative animate-fadeIn">

                {/* Close button */}
                <button
                    onClick={closeModal}
                    className="absolute right-3 top-3 text-gray-500 hover:text-black"
                >
                    <X size={22} />
                </button>

                <h2 className="text-xl font-bold mb-4 text-gray-800">Create Post</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Content input */}
                    <textarea
                        className="border p-3 rounded-md h-28 text-gray-800"
                        placeholder="Write your theory..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {/* Anime dropdown */}
                    <select
                        className="border p-2 rounded-md text-gray-800"
                        value={anime}
                        onChange={(e) => setAnime(e.target.value)}
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
                        disabled={content.length < 3}
                        className={`p-2 rounded-md text-white transition-all
            ${content.length < 3 ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"}`}
                    >
                        Post
                    </button>

                </form>
            </div>
        </div>
    );
}
