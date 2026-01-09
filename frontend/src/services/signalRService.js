import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import API_BASE_URL from '../apiConfig';

class SignalRService {
    constructor() {
        this.connection = null;
        this.isConnected = false;
    }

    async startConnection(token) {
        if (this.connection) {
            await this.stopConnection();
        }

        this.connection = new HubConnectionBuilder()
            .withUrl(`${API_BASE_URL}/chathub`, {
                accessTokenFactory: () => token,
                skipNegotiation: true,
                transport: 1 // WebSockets
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        try {
            await this.connection.start();
            this.isConnected = true;
            console.log('SignalR Connected');
        } catch (error) {
            console.error('SignalR Connection Error:', error);
            this.isConnected = false;
        }
    }

    async stopConnection() {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
            this.isConnected = false;
        }
    }

    // Room methods
    async joinRoom(roomId) {
        if (this.connection && this.isConnected) {
            await this.connection.invoke('JoinRoom', roomId.toString());
        }
    }

    async leaveRoom(roomId) {
        if (this.connection && this.isConnected) {
            await this.connection.invoke('LeaveRoom', roomId.toString());
        }
    }

    async sendRoomMessage(roomId, message) {
        if (this.connection && this.isConnected) {
            await this.connection.invoke('SendRoomMessage', roomId.toString(), message);
        }
    }

    // Event listeners
    onReceiveMessage(callback) {
        if (this.connection) {
            this.connection.on('ReceiveMessage', callback);
        }
    }

    onUserJoined(callback) {
        if (this.connection) {
            this.connection.on('UserJoined', callback);
        }
    }

    onUserLeft(callback) {
        if (this.connection) {
            this.connection.on('UserLeft', callback);
        }
    }

    offReceiveMessage() {
        if (this.connection) {
            this.connection.off('ReceiveMessage');
        }
    }

    offUserJoined() {
        if (this.connection) {
            this.connection.off('UserJoined');
        }
    }

    offUserLeft() {
        if (this.connection) {
            this.connection.off('UserLeft');
        }
    }
}

export default new SignalRService();