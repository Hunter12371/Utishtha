import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  licensePlate: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['available', 'busy', 'offline'], 
    default: 'offline' 
  },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  socketId: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model('Driver', driverSchema);
