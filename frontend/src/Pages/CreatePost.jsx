import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { ArrowLeft, Image, Video, Smile, X, AlertCircle } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

export default function CreatePost() {
    const [question, setQuestion] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedMedia, setSelectedMedia] = useState(null);
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const MAX_QUESTION_LENGTH = 280;
    const MAX_DESCRIPTION_LENGTH = 1000;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) {
            setError('Question is required');
            return;
        }

        if (question.length > MAX_QUESTION_LENGTH) {
            setError(`Question must be ${MAX_QUESTION_LENGTH} characters or less`);
            return;
        }

        if (description.length > MAX_DESCRIPTION_LENGTH) {
            setError(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`);
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    question: question.trim(),
                    description: description.trim() || null
                })
            });

            if (response.ok) {
                navigate('/');
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to create post' }));
                setError(errorData.message || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMediaSelect = (type) => {
        // TODO: Implement media upload
        console.log('Media type selected:', type);
    };

    const removeMedia = () => {
        setSelectedMedia(null);
    };

    const canPost = question.trim() && question.length <= MAX_QUESTION_LENGTH && description.length <= MAX_DESCRIPTION_LENGTH;

    return (
        <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{borderColor: 'var(--border-color)'}}>
                <button 
                    onClick={() => navigate('/')}
                    className="p-2 rounded-lg transition-colors hover:opacity-80"
                    style={{color: 'var(--text-primary)'}}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-semibold" style={{color: 'var(--text-primary)'}}>Create Post</h1>
                <button
                    onClick={handleSubmit}
                    disabled={!canPost || isLoading}
                    className="px-6 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        backgroundColor: canPost && !isLoading ? '#3b82f6' : 'var(--bg-secondary)',
                        color: canPost && !isLoading ? 'white' : 'var(--text-secondary)'
                    }}
                >
                    {isLoading ? 'Posting...' : 'Post'}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-4 mt-4 p-3 rounded-lg flex items-center gap-2" style={{backgroundColor: '#fee2e2', color: '#dc2626'}}>
                    <AlertCircle size={16} />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* Content */}
            <div className="p-4">
                <div className="flex gap-3">
                    {user?.profilePictureUrl ? (
                        <img 
                            src={user.profilePictureUrl} 
                            alt="Profile" 
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--bg-secondary)'}}>
                            <span className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </span>
                        </div>
                    )}
                    
                    <div className="flex-1">
                        {/* Question Input */}
                        <div className="mb-4">
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="What's your question or topic?"
                                className="w-full min-h-[120px] text-xl resize-none border-none outline-none bg-transparent placeholder-opacity-60"
                                style={{color: 'var(--text-primary)'}}
                                autoFocus
                                maxLength={MAX_QUESTION_LENGTH}
                            />
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs" style={{color: 'var(--text-secondary)'}}>Question</span>
                                <span className={`text-xs ${question.length > MAX_QUESTION_LENGTH * 0.9 ? 'text-red-500' : ''}`} style={{color: question.length > MAX_QUESTION_LENGTH * 0.9 ? '#ef4444' : 'var(--text-secondary)'}}>
                                    {question.length}/{MAX_QUESTION_LENGTH}
                                </span>
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className="border-t pt-4" style={{borderColor: 'var(--border-color)'}}>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add more details (optional)..."
                                className="w-full min-h-[100px] resize-none border-none outline-none bg-transparent placeholder-opacity-60"
                                style={{color: 'var(--text-primary)'}}
                                maxLength={MAX_DESCRIPTION_LENGTH}
                            />
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs" style={{color: 'var(--text-secondary)'}}>Description (Optional)</span>
                                <span className={`text-xs ${description.length > MAX_DESCRIPTION_LENGTH * 0.9 ? 'text-red-500' : ''}`} style={{color: description.length > MAX_DESCRIPTION_LENGTH * 0.9 ? '#ef4444' : 'var(--text-secondary)'}}>
                                    {description.length}/{MAX_DESCRIPTION_LENGTH}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selected Media Preview */}
                {selectedMedia && (
                    <div className="mt-4 p-3 rounded-lg border relative" style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)'}}>
                        <button
                            onClick={removeMedia}
                            className="absolute top-2 right-2 p-1 rounded-full" 
                            style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                        >
                            <X size={16} />
                        </button>
                        <div className="text-sm" style={{color: 'var(--text-secondary)'}}>
                            Media selected: {selectedMedia.name}
                        </div>
                    </div>
                )}

                {/* Media Options */}
                <div className="flex items-center gap-4 mt-6 ml-15">
                    <button 
                        onClick={() => handleMediaSelect('image')}
                        className="flex items-center gap-2 p-2 rounded-lg transition-colors hover:opacity-80"
                        style={{color: '#3b82f6', backgroundColor: 'var(--bg-secondary)'}}
                    >
                        <Image size={20} />
                        <span className="text-sm">Photo</span>
                    </button>
                    <button 
                        onClick={() => handleMediaSelect('video')}
                        className="flex items-center gap-2 p-2 rounded-lg transition-colors hover:opacity-80"
                        style={{color: '#3b82f6', backgroundColor: 'var(--bg-secondary)'}}
                    >
                        <Video size={20} />
                        <span className="text-sm">Video</span>
                    </button>
                    <button 
                        onClick={() => handleMediaSelect('emoji')}
                        className="flex items-center gap-2 p-2 rounded-lg transition-colors hover:opacity-80"
                        style={{color: '#3b82f6', backgroundColor: 'var(--bg-secondary)'}}
                    >
                        <Smile size={20} />
                        <span className="text-sm">Emoji</span>
                    </button>
                </div>
            </div>
        </div>
    );
}