import express from 'express';
import {
  getAgents, getAgentById, runAgent, getAgentHistory,
  getAllAgentsAdmin, createAgent, updateAgent, deleteAgent,
} from '../controllers/agentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer routes
router.get('/', protect, getAgents);
router.get('/history', protect, getAgentHistory);
router.get('/:agentId', protect, getAgentById);
router.post('/run', protect, runAgent);

// Admin routes
router.get('/admin/all', protect, admin, getAllAgentsAdmin);
router.post('/admin/create', protect, admin, createAgent);
router.patch('/admin/:agentId', protect, admin, updateAgent);
router.delete('/admin/:agentId', protect, admin, deleteAgent);

export default router;
