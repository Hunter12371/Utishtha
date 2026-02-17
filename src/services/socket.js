import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';
let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('✓ Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('✗ Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Driver functions
export const connectDriver = (driverId) => {
  const socket = getSocket();
  socket.emit('driverConnect', driverId);
};

export const updateDriverLocation = (driverId, location) => {
  const socket = getSocket();
  socket.emit('driverLocationUpdate', { driverId, location });
};

// Dispatcher functions
export const connectDispatcher = () => {
  const socket = getSocket();
  socket.emit('dispatcherConnect');
};

// Patient functions
export const trackRequest = (requestId) => {
  const socket = getSocket();
  socket.emit('trackRequest', requestId);
};

// Listen to events
export const onNewRequest = (callback) => {
  const socket = getSocket();
  socket.on('newRequest', callback);
  return () => socket.off('newRequest', callback);
};

export const onDriverLocationUpdate = (callback) => {
  const socket = getSocket();
  socket.on('driverLocationUpdated', callback);
  return () => socket.off('driverLocationUpdated', callback);
};

export const onRequestAssignment = (callback) => {
  const socket = getSocket();
  socket.on('newRequestAssignment', callback);
  return () => socket.off('newRequestAssignment', callback);
};

export const onRequestStatusUpdate = (callback) => {
  const socket = getSocket();
  socket.on('requestStatusUpdate', callback);
  return () => socket.off('requestStatusUpdate', callback);
};
