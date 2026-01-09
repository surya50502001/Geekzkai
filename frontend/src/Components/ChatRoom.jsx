import { useState, useEffect, useRef } from 'react';
import { Send, Users } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import signalRService from '../services/signalRService';
import API_BASE_URL from '../apiConfig';

function ChatRoom({ roomId, roomName }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize SignalR connection and load messages
    useEffect(() => {
        if (!user || !roomId) return;

        const initializeChat = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Start SignalR connection
            await signalRService.startConnection(token);
            
            // Join room
            await signalRService.joinRoom(roomId);
            
            // Load existing messages
            try {
                const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/messages`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data.map(msg => ({
                        id: msg.id,
                        username: msg.user?.username || 'Unknown',
                        message: msg.message,
                        timestamp: msg.sentAt,
                        userId: msg.userId
                    })));
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            }

            // Set up event listeners
            signalRService.onReceiveMessage((messageData) => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    username: messageData.User.Username,
                    message: messageData.Message,
                    timestamp: messageData.SentAt,
                    userId: messageData.User.Id
                }]);
            });

            signalRService.onUserJoined((username) => {
                setOnlineUsers(prev => [...new Set([...prev, username])]);
            });

            signalRService.onUserLeft((username) => {
                setOnlineUsers(prev => prev.filter(u => u !== username));
            });
        };

        initializeChat();

        return () => {
            if (roomId) {
                signalRService.leaveRoom(roomId);
            }
            signalRService.offReceiveMessage();
            signalRService.offUserJoined();
            signalRService.offUserLeft();
        };
    }, [user, roomId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            await signalRService.sendRoomMessage(roomId, newMessage.trim());
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Header */}
            <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {roomName}
                    </h2>
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <Users size={16} />
                        <span>{onlineUsers.length} online</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                    <div key={msg.id} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span 
                                className="font-semibold text-sm"
                                style={{ color: msg.userId === user?.id ? 'var(--accent-color)' : 'var(--text-primary)' }}
                            >
                                {msg.username}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {formatTime(msg.timestamp)}
                            </span>
                        </div>
                        <div 
                            className={`p-3 rounded-lg max-w-xs ${
                                msg.userId === user?.id 
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-auto' 
                                    : 'bg-gray-100 dark:bg-gray-700'
                            }`}
                            style={msg.userId !== user?.id ? { color: 'var(--text-primary)' } : {}}
                        >
                            {msg.message}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                        disabled={!user}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || !user}
                        className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatRoom;