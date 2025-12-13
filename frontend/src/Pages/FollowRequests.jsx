import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Check, X } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import API_BASE_URL from '../apiConfig';

export default function FollowRequests() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFollowRequests();
    }, []);

    const fetchFollowRequests = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/follow/requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Error fetching follow requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequest = async (userId, action) => {
        try {
            const response = await fetch(`${API_BASE_URL}/follow/request/${userId}/${action}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                setRequests(requests.filter(req => req.id !== userId));
            }
        } catch (error) {
            console.error(`Error ${action}ing follow request:`, error);
        }
    };

    return (
        <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
            {/* Header */}
            <div className="sticky top-0 z-10 p-4 border-b flex items-center gap-4" style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)'}}>
                <button onClick={() => navigate(-1)} className="p-2 rounded-lg" style={{color: 'var(--text-primary)'}}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>Follow Requests</h1>
            </div>

            <div className="p-4">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{borderColor: 'var(--text-primary)', borderTopColor: 'transparent'}}></div>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 border-2 rounded-full flex items-center justify-center" style={{borderColor: 'var(--border-color)'}}>
                            <User size={24} style={{color: 'var(--text-secondary)'}} />
                        </div>
                        <p style={{color: 'var(--text-secondary)'}}>No follow requests</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {requests.map((request) => (
                            <div key={request.id} className="flex items-center gap-3 p-3 border rounded-lg" style={{borderColor: 'var(--border-color)'}}>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden" style={{backgroundColor: 'var(--bg-secondary)'}}>
                                    {request.profilePictureUrl ? (
                                        <img src={request.profilePictureUrl} className="w-full h-full object-cover" alt="Profile" />
                                    ) : (
                                        <User size={20} style={{color: 'var(--text-secondary)'}} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium" style={{color: 'var(--text-primary)'}}>{request.username}</h3>
                                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{request.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleRequest(request.id, 'accept')}
                                        className="p-2 rounded-full transition-colors"
                                        style={{backgroundColor: '#10b981', color: 'white'}}
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleRequest(request.id, 'decline')}
                                        className="p-2 rounded-full transition-colors"
                                        style={{backgroundColor: '#ef4444', color: 'white'}}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}