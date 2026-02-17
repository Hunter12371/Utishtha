import Request from '../models/Request.js';
import Driver from '../models/Driver.js';

export const createRequest = async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    
    // Emit to all connected dispatchers
    req.io.emit('newRequest', request);
    
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('assignedDriver')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { assignedDriver: driverId, status: 'assigned' },
      { new: true }
    ).populate('assignedDriver');

    await Driver.findByIdAndUpdate(driverId, { status: 'busy' });

    // Emit to driver
    const driver = await Driver.findById(driverId);
    if (driver.socketId) {
      req.io.to(driver.socketId).emit('newRequestAssignment', request);
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('assignedDriver');

    req.io.emit('requestStatusUpdate', request);

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
