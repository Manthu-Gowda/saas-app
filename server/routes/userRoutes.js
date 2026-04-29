import express from 'express';
import {
  setIndustry, getDashboard, getHistory, getIndustries,
  getProfile, updateProfile, changePassword,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/GetIndustries', getIndustries);
router.get('/GetDashboard', protect, getDashboard);
router.get('/GetHistory', protect, getHistory);
router.post('/SetIndustry', protect, setIndustry);
router.get('/Profile', protect, getProfile);
router.patch('/Profile', protect, updateProfile);
router.post('/ChangePassword', protect, changePassword);

export default router;
