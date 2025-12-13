import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import API_BASE_URL from '../apiConfig';
import FollowButton from '../Components/FollowButton';

export default function FollowersPage() {
    const { userId, type } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchUserInfo();
    }, [userId, type]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const endpoint = type === 'followers' ? 'followers' : 'following';
            const response = await fetch(`${API_BASE_URL}/user/${userId}/${endpoint}`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleUserClick = (user) => {
        navigate(`/user/${user.id}`);
    };

    return (
        <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
            {/* Header */}
            <div className="sticky top-0 z-10 p-4 border-b flex items-center gap-4" style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)'}}>
                <button onClick={() => navigate(-1)} className="p-2 rounded-lg" style={{color: 'var(--text-primary)'}}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>
                    {username}'s {type === 'followers' ? 'Followers' : 'Following'}
                </h1>
            </div>

            {/* Content */}
            <div className="p-4">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{borderColor: 'var(--text-primary)'}}></div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12">
                        <User size={48} className="mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
                        <p style={{color: 'var(--text-secondary)'}}>
                            No {type === 'followers' ? 'followers' : 'following'} yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                                <div 
                                    className="flex items-center gap-3 flex-1 cursor-pointer"
                                    onClick={() => handleUserClick(user)}
                                >
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden" style={{backgroundColor: 'var(--bg-primary)'}}>
                                        {user.profilePictureUrl ? (
                                            <img 
                                                src={user.profilePictureUrl} 
                                                className="w-full h-full object-cover" 
                                                alt={user.username} 
                                            />
                                        ) : (
                                            <User size={24} style={{color: 'var(--text-secondary)'}} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium" style={{color: 'var(--text-primary)'}}>
                                            {user.username}
                                        </p>
                                        {user.bio && (
                                            <p className="text-sm truncate" style={{color: 'var(--text-secondary)'}}>
                                                {user.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="ml-2">
                                    <FollowButton userId={user.id} username={user.username} onFollowChange={fetchUsers} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}