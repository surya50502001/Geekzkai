import { useState } from "react";
import { X, FileText, Users, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Create() {
    const navigate = useNavigate();

    const createOptions = [
        {
            id: "post",
            title: "Create Post",
            description: "Share your thoughts and questions",
            icon: FileText,
            path: "/create/post"
        },
        {
            id: "room",
            title: "Create Room",
            description: "Start a discussion room",
            icon: Users,
            path: "/create/room"
        },
        {
            id: "live",
            title: "Go Live",
            description: "Start a live stream",
            icon: Video,
            path: "/create/live"
        }
    ];

    return (
        <div className="min-h-screen p-4" style={{backgroundColor: 'var(--bg-primary)'}}>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold" style={{color: 'var(--text-primary)'}}>Create</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg transition-colors"
                    style={{color: 'var(--text-primary)'}}
                >
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-4">
                {createOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                        <button
                            key={option.id}
                            onClick={() => navigate(option.path)}
                            className="w-full p-6 rounded-xl border transition-all duration-200 hover:scale-[1.02]"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)'
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--bg-primary)'}}>
                                    <Icon size={24} style={{color: 'var(--text-primary)'}} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold">{option.title}</h3>
                                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{option.description}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}