import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { ArrowLeft, Send, Plus, X, MessageCircle } from 'lucide-react';
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
            } else {
                setConversations([]);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setConversations([]);
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
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
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
                // Add the message to local state immediately for better UX
                const newMsg = {
                    id: Date.now(),
                    senderId: user.id,
                    receiverId: selectedChat.userId,
                    content: newMessage,
                    createdAt: new Date().toISOString()
                };
                setMessages(prev => [...prev, newMsg]);
                fetchConversations();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="h-screen flex flex-col md:flex-row" style={{backgroundColor: 'var(--bg-primary)'}}>
            {/* New Chat Modal */}
            {showNewChat && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-md rounded-xl shadow-xl" style={{backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)'}}>
                        <div className="flex items-center justify-between p-6 border-b" style={{borderColor: 'var(--border-color)'}}>
                            <h3 className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>New Chat</h3>
                            <button onClick={() => setShowNewChat(false)} className="p-1 rounded-full hover:bg-gray-100" style={{color: 'var(--text-secondary)'}}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    searchUsers(e.target.value);
                                }}
                                className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}}
                            />
                            <div className="mt-4 max-h-60 overflow-y-auto">
                                {searchResults.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => startNewChat(user)}
                                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-50"
                                        style={{'&:hover': {backgroundColor: 'var(--bg-secondary)'}}}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium" style={{color: 'var(--text-primary)'}}>{user.username}</p>
                                            <p className="text-sm" style={{color: 'var(--text-secondary)'}}>{user.email}</p>
                                        </div>
                                    </div>
                                ))}
                                {searchQuery && searchResults.length === 0 && (
                                    <p className="text-center py-8" style={{color: 'var(--text-secondary)'}}>No users found</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Conversations List */}
            <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} md:w-80 flex-col border-r`} style={{borderColor: 'var(--border-color)'}}>
                <div className="p-4 border-b flex items-center justify-between" style={{borderColor: 'var(--border-color)'}}>
                    <h2 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>Messages</h2>
                    <button
                        onClick={() => setShowNewChat(true)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        style={{color: 'var(--text-primary)'}}
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <MessageCircle size={24} style={{color: 'var(--text-secondary)'}} />
                            </div>
                            <p className="text-center" style={{color: 'var(--text-secondary)'}}>No conversations yet</p>
                            <p className="text-sm text-center mt-1" style={{color: 'var(--text-secondary)'}}>Start a new chat to begin messaging</p>
                            <button
                                onClick={() => setShowNewChat(true)}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Start New Chat
                            </button>
                        </div>
                    ) : (
                        conversations.map((conversation) => (
                            <div
                                key={conversation.userId}
                                onClick={() => setSelectedChat(conversation)}
                                className="p-4 cursor-pointer transition-colors hover:bg-gray-50"
                                style={{
                                    backgroundColor: selectedChat?.userId === conversation.userId ? 'var(--bg-secondary)' : 'transparent'
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                            {conversation.user.username[0].toUpperCase()}
                                        </div>
                                        {conversation.unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {conversation.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate" style={{color: 'var(--text-primary)'}}>
                                            {conversation.user.username}
                                        </h3>
                                        <p className="text-sm truncate" style={{color: 'var(--text-secondary)'}}>
                                            {conversation.lastMessage.content}
                                        </p>
                                    </div>
                                    <div className="text-xs" style={{color: 'var(--text-secondary)'}}>
                                        {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center gap-3 bg-white" style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)'}}>
                            <button 
                                onClick={() => setSelectedChat(null)} 
                                className="md:hidden p-2 rounded-full hover:bg-gray-100"
                                style={{color: 'var(--text-primary)'}}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {selectedChat.user.username[0].toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-semibold" style={{color: 'var(--text-primary)'}}>{selectedChat.user.username}</h3>
                                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Active now</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto" style={{backgroundColor: 'var(--bg-secondary)'}}>
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                        <MessageCircle size={24} style={{color: 'var(--text-secondary)'}} />
                                    </div>
                                    <p style={{color: 'var(--text-secondary)'}}>No messages yet</p>
                                    <p className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>Send a message to start the conversation</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.senderId === user.id ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                                style={{
                                                    backgroundColor: message.senderId === user.id ? '#3b82f6' : 'var(--bg-primary)',
                                                    color: message.senderId === user.id ? 'white' : 'var(--text-primary)',
                                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                                                }}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                                <p className="text-xs mt-1 opacity-70">
                                                    {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t" style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)'}}>
                            <form onSubmit={handleSendMessage} className="flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 p-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                            <MessageCircle size={32} style={{color: 'var(--text-secondary)'}} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--text-primary)'}}>Your Messages</h3>
                        <p className="text-center mb-6" style={{color: 'var(--text-secondary)'}}>Send private messages to friends and connect with your community</p>
                        <button
                            onClick={() => setShowNewChat(true)}
                            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        >
                            Start New Chat
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}