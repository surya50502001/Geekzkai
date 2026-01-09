import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import API_BASE_URL from '../apiConfig';

function RoomDebug() {
    const { user } = useAuth();
    const [debugInfo, setDebugInfo] = useState('');
    const [rooms, setRooms] = useState([]);

    const addLog = (message) => {
        setDebugInfo(prev => prev + '\n' + new Date().toLocaleTimeString() + ': ' + message);
        console.log(message);
    };

    const testRoomEndpoints = async () => {
        setDebugInfo('=== ROOM DEBUG TEST ===');
        
        const token = localStorage.getItem('token');
        addLog(`Token exists: ${!!token}`);
        addLog(`API Base URL: ${API_BASE_URL}`);
        addLog(`User: ${user ? user.username : 'Not logged in'}`);

        try {
            // Test 1: Get all rooms
            addLog('Testing GET /room...');
            const response = await fetch(`${API_BASE_URL}/room`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            
            addLog(`Response status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                addLog(`Rooms found: ${data.length}`);
                setRooms(data);
                
                if (data.length > 0) {
                    addLog(`First room: ID=${data[0].id}, Title="${data[0].title}"`);
                    
                    // Test 2: Get specific room
                    const roomResponse = await fetch(`${API_BASE_URL}/room/${data[0].id}`);
                    addLog(`Single room response: ${roomResponse.status}`);
                    
                    if (roomResponse.ok) {
                        const roomData = await roomResponse.json();
                        addLog(`Room details: ${JSON.stringify(roomData, null, 2)}`);
                    } else {
                        const errorText = await roomResponse.text();
                        addLog(`Room error: ${errorText}`);
                    }
                }
            } else {
                const errorText = await response.text();
                addLog(`Error: ${errorText}`);
            }
        } catch (error) {
            addLog(`Exception: ${error.message}`);
        }
    };

    const createTestRoom = async () => {
        if (!user) {
            addLog('Must be logged in to create room');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/room`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: 'Test Room ' + Date.now(),
                    description: 'Debug test room',
                    maxParticipants: 10
                })
            });

            addLog(`Create room response: ${response.status}`);
            
            if (response.ok) {
                const room = await response.json();
                addLog(`Room created: ID=${room.id}, Title="${room.title}"`);
                testRoomEndpoints(); // Refresh the list
            } else {
                const errorText = await response.text();
                addLog(`Create error: ${errorText}`);
            }
        } catch (error) {
            addLog(`Create exception: ${error.message}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
            <h1 className="text-2xl font-bold mb-4">Room Debug Tool</h1>
            
            <div className="flex gap-4 mb-6">
                <button 
                    onClick={testRoomEndpoints}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Test Room Endpoints
                </button>
                <button 
                    onClick={createTestRoom}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    disabled={!user}
                >
                    Create Test Room
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Debug Log</h3>
                    <pre 
                        className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-auto h-96"
                        style={{fontFamily: 'monospace'}}
                    >
                        {debugInfo}
                    </pre>
                </div>
                
                <div>
                    <h3 className="text-lg font-semibold mb-2">Rooms ({rooms.length})</h3>
                    <div className="space-y-2 h-96 overflow-auto">
                        {rooms.map(room => (
                            <div key={room.id} className="border p-3 rounded" style={{borderColor: 'var(--border-color)'}}>
                                <div className="font-semibold">ID: {room.id}</div>
                                <div>Title: {room.title}</div>
                                <div>Participants: {room.currentParticipants}/{room.maxParticipants}</div>
                                <div>Creator: {room.creator?.username || 'Unknown'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomDebug;