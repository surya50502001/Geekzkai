import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';
import FollowButton from './FollowButton';

export default function FollowersModal({ isOpen, onClose, userId, type, username, onFollowChange }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && userId) {
            fetchUsers();
        }
    }, [isOpen, userId, type]);

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

    const handleUserClick = (user) => {
        onClose();
        navigate(`/user/${user.id}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {username}'s {type === 'followers' ? 'Followers' : 'Following'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-8">
                            <User size={48} className="mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500 dark:text-gray-400">
                                No {type === 'followers' ? 'followers' : 'following'} yet
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 space-y-3">
                            {users.map((user) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div 
                                        className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                            {user.profilePictureUrl ? (
                                                <img 
                                                    src={user.profilePictureUrl} 
                                                    className="w-full h-full object-cover" 
                                                    alt={user.username} 
                                                />
                                            ) : (
                                                <User size={20} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {user.username}
                                            </p>
                                            {user.bio && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {user.bio}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="ml-2">
                                        <FollowButton userId={user.id} username={user.username} onFollowChange={onFollowChange} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}