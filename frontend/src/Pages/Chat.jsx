import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        try {
            const response = await fetch('http://localhost:5131/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    receiverId: selectedChat.id,
                    content: newMessage
                })
            });

            if (response.ok) {
                setNewMessage('');
                // Refresh messages
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="min-h-screen flex" style={{backgroundColor: 'var(--bg-primary)'}}>
            {/* Conversations List */}
            <div className="w-1/3 border-r" style={{borderColor: 'var(--border-color)'}}>
                <div className="p-4 border-b" style={{borderColor: 'var(--border-color)'}}>
                    <h2 className="text-xl font-semibold" style={{color: 'var(--text-primary)'}}>Messages</h2>
                </div>
                <div className="p-4">
                    <p style={{color: 'var(--text-secondary)'}}>No conversations yet</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center gap-3" style={{borderColor: 'var(--border-color)'}}>
                            <button onClick={() => setSelectedChat(null)}>
                                <ArrowLeft size={20} />
                            </button>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                {selectedChat.username[0].toUpperCase()}
                            </div>
                            <span className="font-medium" style={{color: 'var(--text-primary)'}}>{selectedChat.username}</span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            <p style={{color: 'var(--text-secondary)'}}>No messages yet</p>
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