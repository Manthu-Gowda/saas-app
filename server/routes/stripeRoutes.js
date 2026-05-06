import express from 'express';
import {
  createCheckoutSession,
  createPortalSession,
  handleWebhook,
  getMyInvoices,
  getMySubscription,
} from '../controllers/stripeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Webhook uses raw body — registered in index.js before express.json()
router.post('/webhook', handleWebhook);

// Protected customer routes
router.post('/create-checkout', protect, createCheckoutSession);
router.post('/create-portal', protect, createPortalSession);
router.get('/my-invoices', protect, getMyInvoices);
router.get('/my-subscription', protect, getMySubscription);

export default router;
