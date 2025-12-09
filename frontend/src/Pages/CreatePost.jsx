import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { ArrowLeft, Image, Video, Smile } from 'lucide-react';

export default function CreatePost() {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5131/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                navigate('/');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{borderColor: 'var(--border-color)'}}>
                <button 
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-semibold">Create Post</h1>
                <button
                    onClick={handleSubmit}
                    disabled={!content.trim() || isLoading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
                >
                    {isLoading ? 'Posting...' : 'Post'}
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex gap-3">
                    <img 
                        src={user?.profilePictureUrl || '/default-avatar.png'} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's happening?"
                            className="w-full min-h-[200px] text-xl resize-none border-none outline-none bg-transparent"
                            style={{color: 'var(--text-primary)'}}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Media Options */}
                <div className="flex items-center gap-4 mt-6 ml-15">
                    <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-500">
                        <Image size={20} />
                        <span className="text-sm">Photo</span>
                    </button>
                    <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-500">
                        <Video size={20} />
                        <span className="text-sm">Video</span>
                    </button>
                    <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-500">
                        <Smile size={20} />
                        <span className="text-sm">Emoji</span>
                    </button>
                </div>
            </div>
        </div>
    );
}