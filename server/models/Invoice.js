import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stripeInvoiceId: { type: String, unique: true, sparse: true },
    stripeCustomerId: { type: String },
    number: { type: String },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'usd' },
    status: {
      type: String,
      enum: ['draft', 'open', 'paid', 'void', 'uncollectible'],
      default: 'open',
    },
    planTier: { type: String },
    invoicePdf: { type: String },
    hostedInvoiceUrl: { type: String },
    periodStart: { type: Date },
    periodEnd: { type: Date },
  },
  { timestamps: true }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
