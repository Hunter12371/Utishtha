import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import { setupSocketHandlers } from './sockets/socketManager.js';
import User from './models/User.js';
import Driver from './models/Driver.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Connect to MongoDB
await connectDB();

// Auto-seed database in development
if (process.env.NODE_ENV === 'development') {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('🌱 Seeding database...');
    
    // Create admin user
    const admin = new User({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('✓ Admin user created (username: admin, password: admin123)');

    // Create sample drivers
    const drivers = [
      { name: 'Rajesh Kumar', phone: '+919876543210', licensePlate: 'DL-01-AB-1234', status: 'available', location: { lat: 28.6139, lng: 77.2090 } },
      { name: 'Priya Sharma', phone: '+919876543211', licensePlate: 'DL-02-CD-5678', status: 'available', location: { lat: 28.7041, lng: 77.1025 } },
      { name: 'Amit Patel', phone: '+919876543212', licensePlate: 'DL-03-EF-9012', status: 'offline', location: { lat: 28.5355, lng: 77.3910 } }
    ];
    await Driver.insertMany(drivers);
    console.log('✓ Sample drivers created');
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/requests', requestRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Utishta Backend Running' });
});

// Setup Socket.io
setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io ready for real-time connections`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
