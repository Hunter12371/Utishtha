import express from 'express';
import { loginAdmin, loginDriver } from '../controllers/authController.js';

const router = express.Router();

router.post('/admin/login', loginAdmin);
router.post('/driver/login', loginDriver);

export default router;
