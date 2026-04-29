import express from 'express';
import { setIndustry, getDashboard, getHistory, getIndustries } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/GetIndustries', protect, getIndustries);
router.get('/GetDashboard', protect, getDashboard);
router.get('/GetHistory', protect, getHistory);
router.post('/SetIndustry', protect, setIndustry);

export default router;
