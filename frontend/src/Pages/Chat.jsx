import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { ArrowLeft, Send, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

export default function Chat() {
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showNewChat, setShowNewChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.userId);
        }
    }, [selectedChat]);

    const fetchConversations = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/message/conversations`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/message/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const searchUsers = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/user/search?query=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
            }
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const startNewChat = (user) => {
        setSelectedChat({ userId: user.id, user });
        setShowNewChat(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        try {
            const response = await fetch(`${API_BASE_URL}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    receiverId: selectedChat.userId,
                    content: newMessage
                })
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages(selectedChat.userId);
                fetchConversations();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="min-h-screen flex" style={{backgroundColor: 'var(--bg-primary)'}}>
            {/* New Chat Modal */}
            {showNewChat && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4" style={{backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)'}}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>New Chat</h3>
                            <button onClick={() => setShowNewChat(false)} style={{color: 'var(--text-secondary)'}}>
                                <X size={20} />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                searchUsers(e.target.value);
                            }}
                            className="w-full p-3 rounded-lg border mb-4"
                            style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}}
                        />
                        <div className="max-h-60 overflow-y-auto">
                            {searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => startNewChat(user)}
                                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-opacity-50"
                                    style={{backgroundColor: 'transparent'}}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium" style={{color: 'var(--text-primary)'}}>{user.username}</p>
                                        <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{user.email}</p>
                                    </div>
                                </div>
                            ))}
                            {searchQuery && searchResults.length === 0 && (
                                <p className="text-center py-4" style={{color: 'var(--text-secondary)'}}>No users found</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Conversations List */}
            <div className="w-1/3 border-r" style={{borderColor: 'var(--border-color)'}}>
                <div className="p-4 border-b flex items-center justify-between" style={{borderColor: 'var(--border-color)'}}>
                    <h2 className="text-xl font-semibold" style={{color: 'var(--text-primary)'}}>Messages</h2>
                    <button
                        onClick={() => setShowNewChat(true)}
                        className="p-2 rounded-lg hover:bg-opacity-50"
                        style={{backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}}
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <div className="overflow-y-auto">
                    {loading ? (
                        <div className="p-4">
                            <p style={{color: 'var(--text-secondary)'}}>Loading...</p>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="p-4">
                            <p style={{color: 'var(--text-secondary)'}}>No conversations yet</p>
                        </div>
                    ) : (
                        conversations.map((conversation) => (
                            <div
                                key={conversation.userId}
                                onClick={() => setSelectedChat(conversation)}
                                className="p-4 border-b cursor-pointer hover:bg-opacity-50"
                                style={{
                                    borderColor: 'var(--border-color)',
                                    backgroundColor: selectedChat?.userId === conversation.userId ? 'var(--bg-secondary)' : 'transparent'
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                        {conversation.user.username[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium" style={{color: 'var(--text-primary)'}}>
                                            {conversation.user.username}
                                        </h3>
                                        <p className="text-sm truncate" style={{color: 'var(--text-secondary)'}}>
                                            {conversation.lastMessage.content}
                                        </p>
                                    </div>
                                    {conversation.unreadCount > 0 && (
                                        <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {conversation.unreadCount}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center gap-3" style={{borderColor: 'var(--border-color)'}}>
                            <button onClick={() => setSelectedChat(null)} style={{color: 'var(--text-primary)'}}>
                                <ArrowLeft size={20} />
                            </button>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                {selectedChat.user.username[0].toUpperCase()}
                            </div>
                            <span className="font-medium" style={{color: 'var(--text-primary)'}}>{selectedChat.user.username}</span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {messages.length === 0 ? (
                                <p style={{color: 'var(--text-secondary)'}}>No messages yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                    message.senderId === user.id
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-800'
                                                }`}
                                                style={{
                                                    backgroundColor: message.senderId === user.id ? '#3b82f6' : 'var(--bg-secondary)',
                                                    color: message.senderId === user.id ? 'white' : 'var(--text-primary)'
                                                }}
                                            >
                                                <p>{message.content}</p>
                                                <p className="text-xs mt-1 opacity-70">
                                                    {new Date(message.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t" style={{borderColor: 'var(--border-color)'}}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 p-3 rounded-lg border"
                                    style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}}
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p style={{color: 'var(--text-secondary)'}}>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}