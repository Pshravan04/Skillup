import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        if (!this.socket) {
            this.socket = io(SOCKET_URL, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            this.socket.on('connect', () => {
                console.log('Socket connected:', this.socket.id);
            });

            this.socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            this.socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        }
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinConversation(conversationId) {
        if (this.socket) {
            this.socket.emit('join_conversation', conversationId);
        }
    }

    sendMessage(data) {
        if (this.socket) {
            this.socket.emit('send_message', data);
        }
    }

    onMessageReceived(callback) {
        if (this.socket) {
            this.socket.on('message_received', callback);
        }
    }

    emitTyping(data) {
        if (this.socket) {
            this.socket.emit('typing', data);
        }
    }

    emitStopTyping(data) {
        if (this.socket) {
            this.socket.emit('stop_typing', data);
        }
    }

    onUserTyping(callback) {
        if (this.socket) {
            this.socket.on('user_typing', callback);
        }
    }

    onUserStopTyping(callback) {
        if (this.socket) {
            this.socket.on('user_stop_typing', callback);
        }
    }

    removeAllListeners() {
        if (this.socket) {
            this.socket.removeAllListeners();
        }
    }
}

export default new SocketService();
