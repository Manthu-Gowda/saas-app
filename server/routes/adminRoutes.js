import express from 'express';
import {
  getDashboardStats,
  getAllUsers, getUserById, updateUser, suspendUser, activateUser,
  resetUserRuns, changePlan, deleteUser,
  getAllIndustries, createIndustry, updateIndustry, deleteIndustry,
  getAllProviders, createProvider, updateProvider, deleteProvider, testProvider,
  getAnalytics, getAuditLogs, getSubscriptionsOverview, getAdminInvoices,
} from '../controllers/adminController.js';
import {
  getAllToolsAdmin, getToolByIdAdmin, createTool, updateTool, deleteTool,
} from '../controllers/toolController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes are protected
router.use(protect, admin);

// Dashboard
router.get('/GetDashboardStats', getDashboardStats);

// Users
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/:userId', updateUser);
router.post('/users/:userId/suspend', suspendUser);
router.post('/users/:userId/activate', activateUser);
router.post('/users/:userId/reset-runs', resetUserRuns);
router.post('/users/:userId/change-plan', changePlan);
router.delete('/users/:userId', deleteUser);

// Tools
router.get('/tools', getAllToolsAdmin);
router.get('/tools/:toolId', getToolByIdAdmin);
router.post('/tools', createTool);
router.patch('/tools/:toolId', updateTool);
router.delete('/tools/:toolId', deleteTool);

// Industries
router.get('/industries', getAllIndustries);
router.post('/industries', createIndustry);
router.patch('/industries/:industryId', updateIndustry);
router.delete('/industries/:industryId', deleteIndustry);

// AI Providers
router.get('/ai-providers', getAllProviders);
router.post('/ai-providers', createProvider);
router.patch('/ai-providers/:providerId', updateProvider);
router.delete('/ai-providers/:providerId', deleteProvider);
router.post('/ai-providers/:providerId/test', testProvider);

// Analytics
router.get('/analytics', getAnalytics);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

// Subscriptions
router.get('/subscriptions', getSubscriptionsOverview);

// Invoices
router.get('/invoices', getAdminInvoices);

export default router;
