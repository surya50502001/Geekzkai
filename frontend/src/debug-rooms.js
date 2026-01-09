// Debug script to test room endpoints
const API_BASE_URL = 'https://geekzkai-backend.onrender.com/api'; // Update with your actual API URL

async function debugRooms() {
    const token = localStorage.getItem('token');
    
    console.log('=== DEBUGGING ROOMS ===');
    console.log('Token exists:', !!token);
    console.log('API Base URL:', API_BASE_URL);
    
    try {
        // Test 1: Fetch all rooms
        console.log('\n1. Testing GET /room');
        const roomsResponse = await fetch(`${API_BASE_URL}/room`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Rooms response status:', roomsResponse.status);
        
        if (roomsResponse.ok) {
            const rooms = await roomsResponse.json();
            console.log('Rooms found:', rooms.length);
            console.log('Rooms data:', rooms);
            
            if (rooms.length > 0) {
                const firstRoom = rooms[0];
                console.log('\n2. Testing GET /room/{id} with first room');
                console.log('Testing room ID:', firstRoom.id);
                
                const roomResponse = await fetch(`${API_BASE_URL}/room/${firstRoom.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log('Single room response status:', roomResponse.status);
                
                if (roomResponse.ok) {
                    const room = await roomResponse.json();
                    console.log('Single room data:', room);
                } else {
                    console.log('Single room error:', await roomResponse.text());
                }
            }
        } else {
            console.log('Rooms error:', await roomsResponse.text());
        }
        
    } catch (error) {
        console.error('Debug error:', error);
    }
}

// Run in browser console: debugRooms()