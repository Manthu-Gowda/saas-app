import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db.js';
import swaggerSpec from './config/swagger.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import ragRoutes from './routes/ragRoutes.js';
import agentRoutes from './routes/agentRoutes.js';

dotenv.config();

connectDB();

const app = express();

// Stripe webhook needs raw body — register before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// Global middleware
app.use(cors());
app.use(express.json());

// Swagger UI — available at http://localhost:5000/api/docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Zynapse API Docs',
  customCss: `
    .swagger-ui .topbar { background: #6c47ff; }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
    .swagger-ui .info .title { color: #6c47ff; }
  `,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
  },
}));

// Raw spec as JSON (useful for Postman/Insomnia import)
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/agents', agentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Zynapse API is running with MongoDB' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs → http://localhost:${PORT}/api/docs`);
});
