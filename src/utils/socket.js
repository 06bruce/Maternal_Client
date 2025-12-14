import { io } from 'socket.io-client';

// Socket connection instance
let socket = null;

/**
 * Initialize Socket.IO connection
 * @param {String} userId - User ID for authentication
 * @returns {Object} Socket instance
 */
export const initializeSocket = (userId) => {
    const SERVER_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    if (socket && socket.connected) {
        console.log('🔌 Socket already connected');
        return socket;
    }

    socket = io(SERVER_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000
    });

    socket.on('connect', () => {
        console.log('✅ Connected to Socket.IO server');

        // Authenticate user
        if (userId) {
            socket.emit('authenticate', userId);
        }
    });

    socket.on('authenticated', (data) => {
        console.log('👤 Authenticated:', data);
    });

    socket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from server:', reason);
    });

    socket.on('connect_error', (error) => {
        console.error('🔴 Connection error:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
        console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
        if (userId) {
            socket.emit('authenticate', userId);
        }
    });

    return socket;
};

/**
 * Get current socket instance
 * @returns {Object} Socket instance
 */
export const getSocket = () => {
    if (!socket) {
        console.warn('⚠️ Socket not initialized. Call initializeSocket first.');
    }
    return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('👋 Socket disconnected');
    }
};

/**
 * Subscribe to emergency alerts
 * @param {Function} callback - Callback function when alert received
 */
export const onEmergencyAlert = (callback) => {
    if (socket) {
        socket.on('emergency-alert', callback);
    }
};

/**
 * Subscribe to emergency updates
 * @param {String} emergencyId - Emergency ID
 * @param {Function} callback - Callback function when update received
 */
export const subscribeToEmergency = (emergencyId, callback) => {
    if (socket) {
        socket.emit('join-emergency', emergencyId);
        socket.on('emergency-update', callback);
    }
};

/**
 * Unsubscribe from emergency updates
 * @param {String} emergencyId - Emergency ID
 */
export const unsubscribeFromEmergency = (emergencyId) => {
    if (socket) {
        socket.emit('leave-emergency', emergencyId);
        socket.off('emergency-update');
    }
};

/**
 * Subscribe to hospital responses
 * @param {Function} callback - Callback function when hospital responds
 */
export const onHospitalResponse = (callback) => {
    if (socket) {
        socket.on('hospital-response', callback);
    }
};

/**
 * Subscribe to appointment reminders
 * @param {Function} callback - Callback function when reminder received
 */
export const onAppointmentReminder = (callback) => {
    if (socket) {
        socket.on('appointment-reminder', callback);
    }
};

/**
 * Subscribe to general notifications
 * @param {Function} callback - Callback function when notification received
 */
export const onNotification = (callback) => {
    if (socket) {
        socket.on('notification', callback);
    }
};

/**
 * Join chat room
 * @param {String} chatRoomId - Chat room ID
 */
export const joinChatRoom = (chatRoomId) => {
    if (socket) {
        socket.emit('join-chat', chatRoomId);
    }
};

/**
 * Send chat message
 * @param {String} chatRoomId - Chat room ID
 * @param {String} message - Message content
 * @param {String} userId - User ID
 * @param {String} userName - User name
 */
export const sendChatMessage = (chatRoomId, message, userId, userName) => {
    if (socket) {
        socket.emit('send-message', {
            chatRoomId,
            message,
            userId,
            userName
        });
    }
};

/**
 * Subscribe to new chat messages
 * @param {Function} callback - Callback function when message received
 */
export const onNewChatMessage = (callback) => {
    if (socket) {
        socket.on('new-message', callback);
    }
};

/**
 * Send typing indicator
 * @param {String} chatRoomId - Chat room ID
 * @param {String} userId - User ID
 * @param {String} userName - User name
 * @param {Boolean} isTyping - Whether user is typing
 */
export const sendTypingIndicator = (chatRoomId, userId, userName, isTyping) => {
    if (socket) {
        socket.emit('typing', {
            chatRoomId,
            userId,
            userName,
            isTyping
        });
    }
};

/**
 * Subscribe to typing indicators
 * @param {Function} callback - Callback function when user is typing
 */
export const onUserTyping = (callback) => {
    if (socket) {
        socket.on('user-typing', callback);
    }
};

/**
 * Subscribe to system announcements
 * @param {Function} callback - Callback function when announcement received
 */
export const onSystemAnnouncement = (callback) => {
    if (socket) {
        socket.on('system-announcement', callback);
    }
};

/**
 * Clean up all socket listeners
 */
export const removeAllSocketListeners = () => {
    if (socket) {
        socket.off('emergency-alert');
        socket.off('emergency-update');
        socket.off('hospital-response');
        socket.off('appointment-reminder');
        socket.off('notification');
        socket.off('new-message');
        socket.off('user-typing');
        socket.off('system-announcement');
    }
};

export default {
    initializeSocket,
    getSocket,
    disconnectSocket,
    onEmergencyAlert,
    subscribeToEmergency,
    unsubscribeFromEmergency,
    onHospitalResponse,
    onAppointmentReminder,
    onNotification,
    joinChatRoom,
    sendChatMessage,
    onNewChatMessage,
    sendTypingIndicator,
    onUserTyping,
    onSystemAnnouncement,
    removeAllSocketListeners
};
