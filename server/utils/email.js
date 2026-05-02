import nodemailer from 'nodemailer';

const getTransporter = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) return null;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const FROM = () => process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@zynapse.app';

export const sendWelcomeEmail = async ({ name, email }) => {
  const transporter = getTransporter();
  if (!transporter) return;
  try {
    await transporter.sendMail({
      from: FROM(),
      to: email,
      subject: 'Welcome to Zynapse!',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6c47ff">Welcome to Zynapse, ${name}!</h2>
          <p>Your account is ready. Start by selecting your industry and exploring AI tools built for your workflow.</p>
          <p style="color:#64748b;font-size:13px">If you did not create this account, please ignore this email.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Welcome email failed:', err.message);
  }
};

export const sendUpgradeEmail = async ({ name, email, planTier }) => {
  const transporter = getTransporter();
  if (!transporter) return;
  const planNames = { FREE: 'Free', STARTER: 'Starter', PRO: 'Professional', BUSINESS: 'Business' };
  try {
    await transporter.sendMail({
      from: FROM(),
      to: email,
      subject: `Your plan has been upgraded to ${planNames[planTier] || planTier}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6c47ff">Plan Upgraded!</h2>
          <p>Hi ${name}, your subscription has been upgraded to <strong>${planNames[planTier] || planTier}</strong>.</p>
          <p>You now have access to all features included in your new plan. Enjoy!</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Upgrade email failed:', err.message);
  }
};

export const sendPaymentConfirmationEmail = async ({ name, email, amount, currency, invoiceNumber, invoicePdf }) => {
  const transporter = getTransporter();
  if (!transporter) return;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'usd').toUpperCase(),
  }).format(amount / 100);
  try {
    await transporter.sendMail({
      from: FROM(),
      to: email,
      subject: `Payment confirmed — ${invoiceNumber || 'Invoice'}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6c47ff">Payment Received</h2>
          <p>Hi ${name}, we received your payment of <strong>${formatted}</strong>.</p>
          <p>Invoice: <strong>${invoiceNumber || '—'}</strong></p>
          ${invoicePdf ? `<p><a href="${invoicePdf}" style="color:#6c47ff">Download Invoice PDF</a></p>` : ''}
        </div>
      `,
    });
  } catch (err) {
    console.error('Payment confirmation email failed:', err.message);
  }
};
