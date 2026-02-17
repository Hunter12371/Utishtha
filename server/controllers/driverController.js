import Driver from '../models/Driver.js';

export const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ status: 'available' });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDriverStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDriver = async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
