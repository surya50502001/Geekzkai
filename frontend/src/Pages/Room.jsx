import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import ChatRoom from '../Components/ChatRoom';
import API_BASE_URL from '../apiConfig';

function Room() {
    const { roomId } = useParams();
    const { user } = useAuth();
    const [room, setRoom] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        fetchRoomDetails();
        if (user) {
            checkMembership();
        }
    }, [roomId, user]);

    const fetchRoomDetails = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`);
            if (response.ok) {
                const data = await response.json();
                setRoom(data);
                setMembers(data.members || []);
            }
        } catch (error) {
            console.error('Error fetching room:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkMembership = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/membership`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setJoined(data.isMember);
            }
        } catch (error) {
            console.error('Error checking membership:', error);
        }
    };

    const handleJoinRoom = async () => {
        if (!user) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                setJoined(true);
                fetchRoomDetails(); // Refresh to get updated member count
            }
        } catch (error) {
            console.error('Error joining room:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                        Room not found
                    </h2>
                    <Link 
                        to="/rooms" 
                        className="text-purple-600 hover:text-purple-700"
                    >
                        Back to Rooms
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link 
                        to="/rooms"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft size={24} style={{ color: 'var(--text-primary)' }} />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            {room.name}
                        </h1>
                        <p className="text-lg mt-2" style={{ color: 'var(--text-secondary)' }}>
                            {room.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <Users size={16} />
                                <span>{members.length} members</span>
                            </div>
                            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <MessageCircle size={16} />
                                <span>Active chat</span>
                            </div>
                        </div>
                    </div>
                    
                    {user && !joined && (
                        <button
                            onClick={handleJoinRoom}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
                        >
                            Join Room
                        </button>
                    )}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Chat Area */}
                    <div className="lg:col-span-3">
                        <div 
                            className="rounded-xl border shadow-lg h-[600px]"
                            style={{ 
                                backgroundColor: 'var(--bg-secondary)',
                                borderColor: 'var(--border-color)'
                            }}
                        >
                            {user && joined ? (
                                <ChatRoom roomId={roomId} roomName={room.name} />
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <MessageCircle size={48} className="mx-auto mb-4 text-gray-400" />
                                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                            {!user ? 'Login Required' : 'Join to Chat'}
                                        </h3>
                                        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                                            {!user 
                                                ? 'Please login to participate in room discussions'
                                                : 'Join this room to start chatting with other members'
                                            }
                                        </p>
                                        {!user ? (
                                            <Link
                                                to="/login"
                                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
                                            >
                                                Login
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={handleJoinRoom}
                                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
                                            >
                                                Join Room
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Room Info */}
                        <div 
                            className="p-6 rounded-xl border"
                            style={{ 
                                backgroundColor: 'var(--bg-secondary)',
                                borderColor: 'var(--border-color)'
                            }}
                        >
                            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                                Room Info
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                        Created by
                                    </span>
                                    <p style={{ color: 'var(--text-primary)' }}>
                                        {room.createdBy || 'Anonymous'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                        Category
                                    </span>
                                    <p style={{ color: 'var(--text-primary)' }}>
                                        {room.category || 'General'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Members List */}
                        <div 
                            className="p-6 rounded-xl border"
                            style={{ 
                                backgroundColor: 'var(--bg-secondary)',
                                borderColor: 'var(--border-color)'
                            }}
                        >
                            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                                Members ({members.length})
                            </h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {members.map((member, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-semibold">
                                            {member.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <span style={{ color: 'var(--text-primary)' }}>
                                            {member.username || `User ${index + 1}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Room;