import Stripe from 'stripe';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import Invoice from '../models/Invoice.js';
import AuditLog from '../models/AuditLog.js';
import { sendUpgradeEmail, sendPaymentConfirmationEmail } from '../utils/email.js';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const PLAN_PRICE_IDS = () => ({
  STARTER: process.env.STRIPE_PRICE_STARTER,
  PRO: process.env.STRIPE_PRICE_PRO,
  BUSINESS: process.env.STRIPE_PRICE_BUSINESS,
});

const PRICE_TO_PLAN = () => {
  const map = {};
  if (process.env.STRIPE_PRICE_STARTER) map[process.env.STRIPE_PRICE_STARTER] = 'STARTER';
  if (process.env.STRIPE_PRICE_PRO) map[process.env.STRIPE_PRICE_PRO] = 'PRO';
  if (process.env.STRIPE_PRICE_BUSINESS) map[process.env.STRIPE_PRICE_BUSINESS] = 'BUSINESS';
  return map;
};

const PLAN_RUNS = { FREE: 10, STARTER: 100, PRO: 500, BUSINESS: -1 };

// ── Create Stripe Checkout Session ────────────────────────────────────────────

export const createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) return res.status(503).json({ message: 'Stripe is not configured on this server.' });

    const { planTier } = req.body;
    const priceId = PLAN_PRICE_IDS()[planTier];
    if (!priceId) {
      return res.status(400).json({ message: `No Stripe price ID configured for plan: ${planTier}. Add STRIPE_PRICE_${planTier} to your .env file.` });
    }

    const user = await User.findById(req.user._id);

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
    }

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${FRONTEND_URL}/billing?success=true&plan=${planTier}`,
      cancel_url: `${FRONTEND_URL}/billing?canceled=true`,
      metadata: { userId: user._id.toString(), planTier },
      subscription_data: {
        metadata: { userId: user._id.toString(), planTier },
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Create Stripe Billing Portal Session ─────────────────────────────────────

export const createPortalSession = async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) return res.status(503).json({ message: 'Stripe is not configured on this server.' });

    const user = await User.findById(req.user._id);
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
    }

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${FRONTEND_URL}/billing`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Stripe Webhook Handler ────────────────────────────────────────────────────

export const handleWebhook = async (req, res) => {
  const stripe = getStripe();
  if (!stripe) return res.status(503).json({ message: 'Stripe not configured' });

  const sig = req.headers['stripe-signature'];
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({ message: 'STRIPE_WEBHOOK_SECRET not configured' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const planTier = session.metadata?.planTier;
        if (!userId || !planTier) break;

        const runsTotal = PLAN_RUNS[planTier] ?? 10;
        const user = await User.findByIdAndUpdate(
          userId,
          { planTier, runsTotal, stripeCustomerId: session.customer },
          { new: true }
        );

        await Subscription.findOneAndUpdate(
          { userId },
          {
            userId,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            planTier,
            status: 'active',
          },
          { upsert: true, new: true }
        );

        await AuditLog.create({
          userId,
          action: 'PLAN_UPGRADED_VIA_STRIPE',
          targetType: 'User',
          targetId: userId,
          metadata: { planTier, sessionId: session.id },
        });

        if (user) {
          await sendUpgradeEmail({ name: user.name, email: user.email, planTier });
        }
        break;
      }

      case 'invoice.paid': {
        const inv = event.data.object;
        const user = await User.findOne({ stripeCustomerId: inv.customer });
        if (!user) break;

        const invoiceDoc = await Invoice.findOneAndUpdate(
          { stripeInvoiceId: inv.id },
          {
            userId: user._id,
            stripeInvoiceId: inv.id,
            stripeCustomerId: inv.customer,
            number: inv.number,
            amount: inv.amount_paid,
            currency: inv.currency,
            status: 'paid',
            invoicePdf: inv.invoice_pdf,
            hostedInvoiceUrl: inv.hosted_invoice_url,
            periodStart: inv.period_start ? new Date(inv.period_start * 1000) : null,
            periodEnd: inv.period_end ? new Date(inv.period_end * 1000) : null,
          },
          { upsert: true, new: true }
        );

        await sendPaymentConfirmationEmail({
          name: user.name,
          email: user.email,
          amount: inv.amount_paid,
          currency: inv.currency,
          invoiceNumber: inv.number || inv.id,
          invoicePdf: inv.invoice_pdf,
        });
        break;
      }

      case 'invoice.payment_failed': {
        const inv = event.data.object;
        const user = await User.findOne({ stripeCustomerId: inv.customer });
        if (!user) break;

        await Subscription.findOneAndUpdate(
          { userId: user._id },
          { status: 'past_due' },
          { upsert: true }
        );

        await Invoice.findOneAndUpdate(
          { stripeInvoiceId: inv.id },
          {
            userId: user._id,
            stripeInvoiceId: inv.id,
            stripeCustomerId: inv.customer,
            number: inv.number,
            amount: inv.amount_due,
            currency: inv.currency,
            status: 'open',
          },
          { upsert: true, new: true }
        );
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        const priceId = sub.items?.data?.[0]?.price?.id;
        const newTier = PRICE_TO_PLAN()[priceId];

        if (newTier) {
          const runsTotal = PLAN_RUNS[newTier] ?? 10;
          await User.findByIdAndUpdate(userId, { planTier: newTier, runsTotal });
        }

        await Subscription.findOneAndUpdate(
          { userId },
          {
            stripeSubscriptionId: sub.id,
            status: sub.status,
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            ...(newTier ? { planTier: newTier } : {}),
          },
          { upsert: true }
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await User.findByIdAndUpdate(userId, { planTier: 'FREE', runsTotal: 10 });
        await Subscription.findOneAndUpdate(
          { userId },
          { status: 'canceled', planTier: 'FREE' }
        );
        break;
      }

      default:
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ── User: Get My Invoices ─────────────────────────────────────────────────────

export const getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── User: Get My Subscription ─────────────────────────────────────────────────

export const getMySubscription = async (req, res) => {
  try {
    const [sub, user] = await Promise.all([
      Subscription.findOne({ userId: req.user._id }),
      User.findById(req.user._id).select('planTier runsUsed runsTotal stripeCustomerId'),
    ]);
    res.json({
      subscription: sub,
      planTier: user.planTier,
      runsUsed: user.runsUsed,
      runsTotal: user.runsTotal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
