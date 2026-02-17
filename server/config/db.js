import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

const connectDB = async () => {
  try {
    // Use in-memory MongoDB for development
    if (process.env.NODE_ENV === 'development') {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`✓ MongoDB In-Memory Server Connected: ${conn.connection.host}`);
    } else {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error(`Error disconnecting: ${error.message}`);
  }
};

export default connectDB;
