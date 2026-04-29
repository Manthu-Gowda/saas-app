import express from 'express';
import { getAllUsers, getDashboardStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/GetAllUsers', protect, admin, getAllUsers);
router.get('/GetDashboardStats', protect, admin, getDashboardStats);

export default router;
