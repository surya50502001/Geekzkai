import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/room`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRooms(data);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading rooms...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Active Rooms</h1>
                <Link to="/create/room" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Create Room
                </Link>
            </div>

            {rooms.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No active rooms found</p>
                    <Link to="/create/room" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
                        Create the First Room
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow" 
                             style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)'}}>
                            <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                            
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4 text-sm">
                                    <span>👥 {room.currentParticipants}/{room.maxParticipants}</span>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        room.currentParticipants >= room.maxParticipants 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {room.currentParticipants >= room.maxParticipants ? 'Full' : 'Available'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img 
                                        src={room.creator?.profilePictureUrl || '/default-avatar.png'} 
                                        alt={room.creator?.username}
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <span className="text-sm text-gray-600">{room.creator?.username}</span>
                                </div>
                                
                                <Link 
                                    to={`/room/${room.id}`}
                                    className={`px-4 py-2 rounded text-sm ${
                                        room.currentParticipants >= room.maxParticipants
                                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {room.currentParticipants >= room.maxParticipants ? 'Full' : 'Join'}
                                </Link>
                            </div>

                            <div className="mt-3 text-xs text-gray-500">
                                Created {new Date(room.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Rooms;