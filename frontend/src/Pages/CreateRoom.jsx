import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        maxParticipants: 50
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const room = await response.json();
                navigate(`/room/${room.id}`);
            } else {
                alert('Failed to create room');
            }
        } catch (error) {
            console.error('Error creating room:', error);
            alert('Error creating room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
            <h1 className="text-3xl font-bold mb-6">Create Room</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Room Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full p-3 rounded-lg border"
                        style={{backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)'}}
                        placeholder="Enter room title"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full p-3 rounded-lg border h-32"
                        style={{backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)'}}
                        placeholder="Describe your room"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Max Participants</label>
                    <input
                        type="number"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                        className="w-full p-3 rounded-lg border"
                        style={{backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)'}}
                        min="2"
                        max="100"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Room'}
                </button>
            </form>
        </div>
    );
};

export default CreateRoom;