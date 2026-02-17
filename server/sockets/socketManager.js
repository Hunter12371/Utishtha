import Driver from '../models/Driver.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Driver joins their room
    socket.on('driverConnect', async (driverId) => {
      try {
        await Driver.findByIdAndUpdate(driverId, { socketId: socket.id });
        socket.join(`driver:${driverId}`);
        console.log(`Driver ${driverId} connected with socket ${socket.id}`);
      } catch (error) {
        console.error('Error connecting driver:', error);
      }
    });

    // Driver location updates
    socket.on('driverLocationUpdate', async (data) => {
      try {
        const { driverId, location } = data;
        await Driver.findByIdAndUpdate(driverId, { location });
        
        // Broadcast to all dispatchers
        io.emit('driverLocationUpdated', { driverId, location });
      } catch (error) {
        console.error('Error updating driver location:', error);
      }
    });

    // Dispatcher joins room
    socket.on('dispatcherConnect', () => {
      socket.join('dispatchers');
      console.log('Dispatcher connected:', socket.id);
    });

    // Patient tracking
    socket.on('trackRequest', (requestId) => {
      socket.join(`request:${requestId}`);
    });

    socket.on('disconnect', async () => {
      try {
        await Driver.findOneAndUpdate(
          { socketId: socket.id },
          { socketId: null }
        );
        console.log('Client disconnected:', socket.id);
      } catch (error) {
        console.error('Error on disconnect:', error);
      }
    });
  });
};
