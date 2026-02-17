import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'picked_up', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  assignedDriver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Driver',
    default: null 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'medium' 
  }
}, { timestamps: true });

export default mongoose.model('Request', requestSchema);
