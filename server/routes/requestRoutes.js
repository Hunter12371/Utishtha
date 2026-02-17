import express from 'express';
import { 
  createRequest, 
  getAllRequests, 
  assignDriver,
  updateRequestStatus 
} from '../controllers/requestController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createRequest);
router.get('/', getAllRequests);
router.put('/:id/assign', authenticate, assignDriver);
router.put('/:id/status', authenticate, updateRequestStatus);

export default router;
