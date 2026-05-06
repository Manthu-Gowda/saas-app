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

// Global response formatter
app.use((req, res, next) => {
  const originalJson = res.json;
  
  res.json = function (body) {
    // Exclude Swagger and Stripe Webhook from formatting
    if (req.originalUrl.startsWith('/api/docs') || req.originalUrl.startsWith('/api/stripe/webhook')) {
      return originalJson.call(this, body);
    }

    // Already formatted check
    if (body && typeof body === 'object' && 'statusCode' in body && 'data' in body) {
      return originalJson.call(this, body);
    }

    // Check if paginated (has total, pageIndex, pageSize)
    let isPaginated = false;
    let paginatedData = null;
    let pageIndex = 1;
    let pageSize = 10;
    let totalRecords = 0;

    if (body && typeof body === 'object' && 'total' in body && 'pageIndex' in body && 'pageSize' in body) {
      isPaginated = true;
      pageIndex = body.pageIndex;
      pageSize = body.pageSize;
      totalRecords = body.total || 0;
      
      const keys = Object.keys(body).filter(k => !['total', 'pageIndex', 'pageSize', 'message'].includes(k));
      if (keys.length > 0) {
        paginatedData = body[keys[0]];
      } else {
        paginatedData = [];
      }
    }

    if (isPaginated) {
      const pIndex = Number(pageIndex) || 1;
      const pSize = Number(pageSize) || 10;
      const hasNextPage = (pIndex * pSize) < totalRecords;
      const hasPreviousPage = pIndex > 1;

      return originalJson.call(this, {
        statusCode: res.statusCode || 200,
        message: body.message || "Success",
        pageIndex: pIndex,
        pageSize: pSize,
        totalRecords,
        hasNextPage,
        hasPreviousPage,
        data: paginatedData
      });
    }

    // Standard format
    let message = "Success";
    let data = body;
    
    if (res.statusCode >= 400 && body && body.message) {
      message = body.message;
      data = {};
    } else if (body && typeof body === 'object' && body.message && Object.keys(body).length === 1) {
      message = body.message;
      data = {};
    } else if (body && typeof body === 'object' && body.message) {
       message = body.message;
       const { message: _, ...rest } = body;
       data = Object.keys(rest).length === 0 ? {} : rest;
    }

    return originalJson.call(this, {
      statusCode: res.statusCode || 200,
      message,
      data: data === undefined ? {} : data
    });
  };
  
  next();
});

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
