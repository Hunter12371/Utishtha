import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Driver from '../models/Driver.js';

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginDriver = async (req, res) => {
  try {
    const { phone } = req.body;
    let driver = await Driver.findOne({ phone });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const token = jwt.sign(
      { id: driver._id, type: 'driver' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
