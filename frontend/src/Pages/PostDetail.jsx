import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ArrowDown, MessageCircle, User, Send } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import API_BASE_URL from '../apiConfig';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(0);

    useEffect(() => {
        fetchPost();
        fetchComments();
        if (token) checkUpvoteStatus();
    }, [id, token]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${id}`);
            if (response.ok) {
                const data = await response.json();
                setPost(data);
                setUpvoteCount(data.upvotes?.length || 0);
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${id}/comments`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const checkUpvoteStatus = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${id}/upvote-status`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setIsUpvoted(data.isUpvoted);
            }
        } catch (error) {
            console.error('Error checking upvote status:', error);
        }
    };

    const handleUpvote = async () => {
        if (!token) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${id}/upvote`, {
                method: isUpvoted ? 'DELETE' : 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.ok) {
                setIsUpvoted(!isUpvoted);
                setUpvoteCount(prev => isUpvoted ? prev - 1 : prev + 1);
            }
        } catch (error) {
            console.error('Error toggling upvote:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!token || !newComment.trim()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/posts/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ text: newComment })
            });

            if (response.ok) {
                setNewComment('');
                fetchComments();
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--bg-primary)'}}>
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{borderColor: 'var(--text-primary)'}}></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--bg-primary)'}}>
                <p style={{color: 'var(--text-secondary)'}}>Post not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
            {/* Header */}
            <div className="sticky top-0 z-10 p-4 border-b flex items-center gap-4" style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)'}}>
                <button onClick={() => navigate(-1)} className="p-2 rounded-lg" style={{color: 'var(--text-primary)'}}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>Post</h1>
            </div>

            <div className="p-4">
                {/* Post */}
                <div className="border rounded-lg p-4 mb-4" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--bg-primary)'}}>
                            <User size={20} style={{color: 'var(--text-secondary)'}} />
                        </div>
                        <div>
                            <p className="font-medium" style={{color: 'var(--text-primary)'}}>{post.user?.username}</p>
                            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <h2 className="text-lg font-semibold mb-2" style={{color: 'var(--text-primary)'}}>{post.question}</h2>
                    {post.description && (
                        <p className="mb-4" style={{color: 'var(--text-secondary)'}}>{post.description}</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleUpvote}
                            className="flex items-center gap-2 p-2 rounded-lg transition-colors"
                            style={{color: isUpvoted ? '#3b82f6' : 'var(--text-secondary)'}}
                        >
                            <ArrowUp size={20} />
                            <span>{upvoteCount}</span>
                        </button>
                        <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)'}}>
                            <MessageCircle size={20} />
                            <span>{comments.length}</span>
                        </div>
                    </div>
                </div>

                {/* Comments */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>Comments</h3>
                    
                    {/* Add Comment */}
                    {token && (
                        <form onSubmit={handleComment} className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 p-3 rounded-lg border"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderColor: 'var(--border-color)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                            <button
                                type="submit"
                                className="p-3 rounded-lg"
                                style={{backgroundColor: '#3b82f6', color: 'white'}}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    )}

                    {/* Comments List */}
                    {comments.map((comment) => (
                        <div key={comment.id} className="border rounded-lg p-4" style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--bg-primary)'}}>
                                    <User size={16} style={{color: 'var(--text-secondary)'}} />
                                </div>
                                <div>
                                    <p className="font-medium text-sm" style={{color: 'var(--text-primary)'}}>{comment.user?.username}</p>
                                    <p className="text-xs" style={{color: 'var(--text-secondary)'}}>{new Date(comment.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p style={{color: 'var(--text-primary)'}}>{comment.text}</p>
                        </div>
                    ))}

                    {comments.length === 0 && (
                        <p className="text-center py-8" style={{color: 'var(--text-secondary)'}}>No comments yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}