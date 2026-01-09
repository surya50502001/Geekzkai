import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Room = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isJoined, setIsJoined] = useState(false);
    const [participants, setParticipants] = useState([]);
    const messagesEndRef = useRef(null);
    const wsRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchRoom();
        fetchMessages();
        
        // Setup WebSocket connection
        const ws = new WebSocket(`${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/room/${id}`);
        wsRef.current = ws;
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'message') {
                setMessages(prev => [...prev, data.message]);
            } else if (data.type === 'userJoined' || data.type === 'userLeft') {
                fetchRoom(); // Refresh room data
            }
        };
        
        return () => {
            ws.close();
        };
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchRoom = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/room/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRoom(data);
                setIsJoined(data.isJoined || false);
            }
        } catch (error) {
            console.error('Error fetching room:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/room/${id}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const joinRoom = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/room/${id}/join`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setIsJoined(true);
                fetchRoom();
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (error) {
            console.error('Error joining room:', error);
        }
    };

    const leaveRoom = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/room/${id}/leave`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setIsJoined(false);
                fetchRoom();
            }
        } catch (error) {
            console.error('Error leaving room:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !isJoined) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/room/${id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: newMessage })
            });
            if (response.ok) {
                const messageData = await response.json();
                setNewMessage('');
                // Send via WebSocket for real-time updates
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({
                        type: 'message',
                        message: messageData
                    }));
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!room) return <div className="p-8 text-center">Room not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
            <div className="mb-6">
                <button onClick={() => navigate('/rooms')} className="text-blue-500 hover:underline mb-4">← Back to Rooms</button>
                <h1 className="text-3xl font-bold">{room.title}</h1>
                <p className="text-gray-600 mt-2">{room.description}</p>
                <div className="flex items-center gap-4 mt-4">
                    <span>👥 {room.currentParticipants}/{room.maxParticipants}</span>
                    <span>👑 {room.creator?.username}</span>
                    {!isJoined ? (
                        <button onClick={joinRoom} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Join Room
                        </button>
                    ) : (
                        <button onClick={leaveRoom} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            Leave Room
                        </button>
                    )}
                </div>
            </div>

            {isJoined ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Participants Panel */}
                    <div className="lg:col-span-1">
                        <div className="border rounded-lg p-4" style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)'}}>
                            <h3 className="text-lg font-semibold mb-4">Participants ({room.currentParticipants})</h3>
                            <div className="space-y-2">
                                {room.participants?.map((participant) => (
                                    <div key={participant.id} className="flex items-center gap-2">
                                        <img 
                                            src={participant.profilePictureUrl || '/default-avatar.png'} 
                                            alt={participant.username}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span className="text-sm">{participant.username}</span>
                                        {participant.id === room.creator?.id && (
                                            <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">Host</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Chat Panel */}
                    <div className="lg:col-span-3">
                        <div className="border rounded-lg p-4" style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)'}}>
                            <h3 className="text-xl font-semibold mb-4">Room Chat</h3>
                            <div className="h-96 overflow-y-auto mb-4 p-3 border rounded" style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)'}}>
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-8">
                                        <p>No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg.id} className="mb-3 p-2 rounded" style={{backgroundColor: msg.user?.id === user?.id ? 'var(--bg-secondary)' : 'transparent'}}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <img 
                                                    src={msg.user?.profilePictureUrl || '/default-avatar.png'} 
                                                    alt={msg.user?.username}
                                                    className="w-6 h-6 rounded-full"
                                                />
                                                <span className="font-semibold text-blue-500">{msg.user?.username}</span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(msg.sentAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <p className="ml-8">{msg.message}</p>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={sendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 p-3 border rounded-lg"
                                    style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)'}}
                                    disabled={!isJoined}
                                />
                                <button 
                                    type="submit" 
                                    disabled={!newMessage.trim() || !isJoined}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Join the room to participate in the discussion</p>
                    <button onClick={joinRoom} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                        Join Room
                    </button>
                </div>
            )}
        </div>
    );
};

export default Room;