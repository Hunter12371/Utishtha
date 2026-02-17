import express from 'express';
import { 
  getAvailableDrivers, 
  getAllDrivers, 
  updateDriverStatus,
  createDriver 
} from '../controllers/driverController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/available', getAvailableDrivers);
router.get('/', getAllDrivers);
router.post('/', createDriver);
router.put('/:id/status', authenticate, updateDriverStatus);

export default router;
