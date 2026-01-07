import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Room = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        fetchRoom();
        fetchMessages();
    }, [id]);

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
        if (!newMessage.trim()) return;

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
                setNewMessage('');
                fetchMessages();
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

            {isJoined && (
                <div className="border rounded-lg p-4" style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)'}}>
                    <h3 className="text-xl font-semibold mb-4">Chat</h3>
                    <div className="h-64 overflow-y-auto mb-4 p-3 border rounded" style={{borderColor: 'var(--border-color)'}}>
                        {messages.map((msg) => (
                            <div key={msg.id} className="mb-2">
                                <span className="font-semibold text-blue-500">{msg.user?.username}: </span>
                                <span>{msg.message}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                    {new Date(msg.sentAt).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 p-2 border rounded"
                            style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)'}}
                        />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Room;