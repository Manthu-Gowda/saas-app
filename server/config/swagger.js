const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Zynapse API',
    version: '1.0.0',
    description:
      'Multi-industry AI SaaS platform. All protected routes require a Bearer JWT token obtained from `/api/auth/Login`.',
    contact: { name: 'Zynapse Support', email: 'support@zynapse.app' },
  },
  servers: [
    { url: 'http://localhost:5000/api', description: 'Local Development' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste your JWT token here (from /auth/Login response)',
      },
    },
    schemas: {
      // ── Enums ───────────────────────────────────────────────────────────────
      PlanTier: { type: 'string', enum: ['FREE', 'STARTER', 'PRO', 'BUSINESS'] },
      UserStatus: { type: 'string', enum: ['active', 'inactive', 'suspended'] },
      UserRole: { type: 'string', enum: ['CUSTOMER', 'ADMIN'] },

      // ── User ────────────────────────────────────────────────────────────────
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '664a1b2c3d4e5f6789012345' },
          name: { type: 'string', example: 'Alice Smith' },
          email: { type: 'string', format: 'email', example: 'alice@example.com' },
          role: { $ref: '#/components/schemas/UserRole' },
          planTier: { $ref: '#/components/schemas/PlanTier' },
          status: { $ref: '#/components/schemas/UserStatus' },
          runsUsed: { type: 'integer', example: 12 },
          runsTotal: { type: 'integer', example: 100, description: '-1 means unlimited' },
          industryId: { type: 'string', nullable: true, example: '664a1b2c3d4e5f6789012346' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },

      // ── Industry ────────────────────────────────────────────────────────────
      Industry: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Marketing' },
          slug: { type: 'string', example: 'marketing' },
          icon: { type: 'string', example: '📣' },
          description: { type: 'string' },
          color: { type: 'string', example: '#6c47ff' },
          status: { type: 'string', enum: ['active', 'inactive'] },
          sortOrder: { type: 'integer' },
        },
      },

      // ── Tool ────────────────────────────────────────────────────────────────
      Tool: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Blog Post Writer' },
          slug: { type: 'string', example: 'blog-post-writer' },
          description: { type: 'string' },
          icon: { type: 'string', example: '✍️' },
          industryId: { type: 'string' },
          systemPrompt: { type: 'string' },
          userPromptTemplate: { type: 'string' },
          fields: { type: 'array', items: { type: 'object' } },
          planRequired: { $ref: '#/components/schemas/PlanTier' },
          outputFormat: { type: 'string', enum: ['text', 'markdown', 'json'] },
          status: { type: 'string', enum: ['active', 'inactive'] },
        },
      },

      // ── Invoice ─────────────────────────────────────────────────────────────
      Invoice: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          userId: { type: 'string' },
          number: { type: 'string', example: 'INV-2026-001' },
          amount: { type: 'integer', example: 2900, description: 'Amount in cents' },
          currency: { type: 'string', example: 'usd' },
          status: { type: 'string', enum: ['draft', 'open', 'paid', 'void', 'uncollectible'] },
          invoicePdf: { type: 'string', format: 'uri' },
          hostedInvoiceUrl: { type: 'string', format: 'uri' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },

      // ── Subscription ────────────────────────────────────────────────────────
      Subscription: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          userId: { type: 'string' },
          stripeSubscriptionId: { type: 'string' },
          planTier: { $ref: '#/components/schemas/PlanTier' },
          status: { type: 'string', enum: ['active', 'past_due', 'canceled', 'unpaid'] },
          currentPeriodEnd: { type: 'string', format: 'date-time' },
        },
      },

      // ── AI Provider ─────────────────────────────────────────────────────────
      AiProvider: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'OpenAI' },
          slug: { type: 'string', example: 'openai' },
          defaultModel: { type: 'string', example: 'gpt-4o' },
          isActive: { type: 'boolean' },
          isDefault: { type: 'boolean' },
          hasApiKey: { type: 'boolean' },
          config: {
            type: 'object',
            properties: {
              maxTokens: { type: 'integer', example: 2000 },
              temperature: { type: 'number', example: 0.7 },
            },
          },
        },
      },

      // ── History ─────────────────────────────────────────────────────────────
      History: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          toolId: { type: 'object', properties: { name: { type: 'string' }, icon: { type: 'string' } } },
          prompt: { type: 'string' },
          response: { type: 'string' },
          status: { type: 'string', enum: ['completed', 'failed', 'processing'] },
          tokensUsed: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },

      // ── Error ───────────────────────────────────────────────────────────────
      Error: {
        type: 'object',
        properties: { message: { type: 'string', example: 'Something went wrong' } },
      },
    },
  },

  tags: [
    { name: 'Auth', description: 'Register & login' },
    { name: 'User', description: 'Profile, dashboard & onboarding' },
    { name: 'Tools', description: 'Browse & run AI tools' },
    { name: 'Stripe', description: 'Checkout, billing portal & invoices' },
    { name: 'Admin — Dashboard', description: 'Platform stats & analytics (admin only)' },
    { name: 'Admin — Users', description: 'User management (admin only)' },
    { name: 'Admin — Tools', description: 'Tool CRUD (admin only)' },
    { name: 'Admin — Industries', description: 'Industry CRUD (admin only)' },
    { name: 'Admin — AI Providers', description: 'AI provider CRUD (admin only)' },
    { name: 'Admin — Billing', description: 'Subscriptions & invoices (admin only)' },
    { name: 'Admin — Audit', description: 'Audit log (admin only)' },
  ],

  paths: {
    // ════════════════════════════════════════════════════════════════════════
    // AUTH
    // ════════════════════════════════════════════════════════════════════════
    '/auth/Register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Alice Smith' },
                  email: { type: 'string', format: 'email', example: 'alice@example.com' },
                  password: { type: 'string', format: 'password', example: 'Secret123!' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User created — returns JWT and user object',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          400: { description: 'User already exists or missing fields', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    '/auth/Login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and get JWT token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'alice@example.com' },
                  password: { type: 'string', example: 'Secret123!' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string', example: 'eyJhbGci...' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: { description: 'Invalid credentials or suspended account', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // USER
    // ════════════════════════════════════════════════════════════════════════
    '/user/GetIndustries': {
      get: {
        tags: ['User'],
        summary: 'Get all active industries',
        security: [],
        responses: {
          200: {
            description: 'Array of industries',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Industry' } } } },
          },
        },
      },
    },

    '/user/GetDashboard': {
      get: {
        tags: ['User'],
        summary: 'Get logged-in user dashboard stats',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Dashboard data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    runsUsed: { type: 'integer' },
                    runsTotal: { type: 'integer' },
                    planTier: { $ref: '#/components/schemas/PlanTier' },
                    industry: { $ref: '#/components/schemas/Industry' },
                    recentActivity: { type: 'array', items: { $ref: '#/components/schemas/History' } },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
    },

    '/user/GetHistory': {
      get: {
        tags: ['User'],
        summary: 'Get AI run history for logged-in user',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: {
            description: 'Paginated history',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    history: { type: 'array', items: { $ref: '#/components/schemas/History' } },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/user/SetIndustry': {
      post: {
        tags: ['User'],
        summary: 'Set the industry for the logged-in user (onboarding)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['industryId'],
                properties: { industryId: { type: 'string', example: '664a1b2c3d4e5f6789012346' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Industry updated', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, industryId: { type: 'object' } } } } } },
        },
      },
    },

    '/user/Profile': {
      get: {
        tags: ['User'],
        summary: 'Get full user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User object', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
        },
      },
      patch: {
        tags: ['User'],
        summary: 'Update user name',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { name: { type: 'string', example: 'New Name' } } },
            },
          },
        },
        responses: {
          200: { description: 'Updated user', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
        },
      },
    },

    '/user/ChangePassword': {
      post: {
        tags: ['User'],
        summary: 'Change account password',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: { type: 'string', example: 'OldPass123!' },
                  newPassword: { type: 'string', example: 'NewPass456!' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Password changed', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
          400: { description: 'Incorrect current password' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // TOOLS
    // ════════════════════════════════════════════════════════════════════════
    '/tools/GetTools': {
      get: {
        tags: ['Tools'],
        summary: "Get all tools for the user's industry",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Array of tools', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Tool' } } } } },
        },
      },
    },

    '/tools/{slug}': {
      get: {
        tags: ['Tools'],
        summary: 'Get a single tool by slug',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string', example: 'blog-post-writer' } }],
        responses: {
          200: { description: 'Tool object', content: { 'application/json': { schema: { $ref: '#/components/schemas/Tool' } } } },
          404: { description: 'Tool not found' },
        },
      },
    },

    '/tools/RunTool': {
      post: {
        tags: ['Tools'],
        summary: 'Run an AI tool and get a response',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['toolId', 'inputs'],
                properties: {
                  toolId: { type: 'string', example: '664a1b2c3d4e5f6789012350' },
                  inputs: {
                    type: 'object',
                    description: 'Key-value pairs matching the tool field names',
                    example: { topic: 'AI in Healthcare', tone: 'Professional' },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'AI response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: { type: 'string' },
                    tokensUsed: { type: 'integer' },
                    runsRemaining: { type: 'integer' },
                  },
                },
              },
            },
          },
          403: { description: 'Run limit reached or plan restriction' },
        },
      },
    },

    '/tools/ExtractPdf': {
      post: {
        tags: ['Tools'],
        summary: 'Extract text from an uploaded PDF file',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: { file: { type: 'string', format: 'binary' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Extracted text', content: { 'application/json': { schema: { type: 'object', properties: { text: { type: 'string' } } } } } },
          400: { description: 'No file uploaded' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // STRIPE
    // ════════════════════════════════════════════════════════════════════════
    '/stripe/create-checkout': {
      post: {
        tags: ['Stripe'],
        summary: 'Create a Stripe checkout session for plan upgrade',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['planTier'],
                properties: { planTier: { type: 'string', enum: ['STARTER', 'PRO', 'BUSINESS'], example: 'PRO' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Stripe checkout URL', content: { 'application/json': { schema: { type: 'object', properties: { url: { type: 'string', format: 'uri', example: 'https://checkout.stripe.com/...' } } } } } },
          400: { description: 'Missing price ID for plan' },
          503: { description: 'Stripe not configured on server' },
        },
      },
    },

    '/stripe/create-portal': {
      post: {
        tags: ['Stripe'],
        summary: 'Open Stripe customer billing portal',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Stripe portal URL', content: { 'application/json': { schema: { type: 'object', properties: { url: { type: 'string', format: 'uri' } } } } } },
          503: { description: 'Stripe not configured' },
        },
      },
    },

    '/stripe/my-invoices': {
      get: {
        tags: ['Stripe'],
        summary: 'Get invoices for the logged-in user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Array of invoices', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Invoice' } } } } },
        },
      },
    },

    '/stripe/my-subscription': {
      get: {
        tags: ['Stripe'],
        summary: 'Get subscription info for the logged-in user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Subscription and plan data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    subscription: { $ref: '#/components/schemas/Subscription' },
                    planTier: { $ref: '#/components/schemas/PlanTier' },
                    runsUsed: { type: 'integer' },
                    runsTotal: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/stripe/webhook': {
      post: {
        tags: ['Stripe'],
        summary: 'Stripe webhook endpoint (called by Stripe only)',
        security: [],
        description: 'Handles: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`',
        requestBody: { description: 'Raw Stripe event payload', content: { 'application/json': { schema: { type: 'object' } } } },
        responses: {
          200: { description: 'Event received' },
          400: { description: 'Webhook signature verification failed' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // ADMIN — DASHBOARD
    // ════════════════════════════════════════════════════════════════════════
    '/admin/GetDashboardStats': {
      get: {
        tags: ['Admin — Dashboard'],
        summary: 'Platform overview stats',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Dashboard stats',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalUsers: { type: 'integer' },
                    activeUsers: { type: 'integer' },
                    suspendedUsers: { type: 'integer' },
                    totalAiRuns: { type: 'integer' },
                    aiRunsToday: { type: 'integer' },
                    planCounts: { type: 'array', items: { type: 'object' } },
                    topTools: { type: 'array', items: { type: 'object' } },
                    signupTrend: { type: 'array', items: { type: 'object' } },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/admin/analytics': {
      get: {
        tags: ['Admin — Dashboard'],
        summary: '30-day platform analytics',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Analytics data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    dailyRuns: { type: 'array', items: { type: 'object' } },
                    toolUsage: { type: 'array', items: { type: 'object' } },
                    industryUsage: { type: 'array', items: { type: 'object' } },
                    planBreakdown: { type: 'array', items: { type: 'object' } },
                    userGrowth: { type: 'array', items: { type: 'object' } },
                    providerUsage: { type: 'array', items: { type: 'object' } },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // ADMIN — USERS
    // ════════════════════════════════════════════════════════════════════════
    '/admin/users': {
      get: {
        tags: ['Admin — Users'],
        summary: 'List all customers with filters and pagination',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by name or email' },
          { name: 'status', in: 'query', schema: { $ref: '#/components/schemas/UserStatus' } },
          { name: 'plan', in: 'query', schema: { $ref: '#/components/schemas/PlanTier' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 25 } },
        ],
        responses: {
          200: {
            description: 'Paginated users',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    users: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    limit: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/admin/users/{userId}': {
      get: {
        tags: ['Admin — Users'],
        summary: 'Get user detail with recent history and audit logs',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'User details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    recentHistory: { type: 'array', items: { $ref: '#/components/schemas/History' } },
                    auditLogs: { type: 'array', items: { type: 'object' } },
                  },
                },
              },
            },
          },
          404: { description: 'User not found' },
        },
      },
      patch: {
        tags: ['Admin — Users'],
        summary: 'Update user info (name, status, plan, runsTotal)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  status: { $ref: '#/components/schemas/UserStatus' },
                  planTier: { $ref: '#/components/schemas/PlanTier' },
                  runsTotal: { type: 'integer' },
                  industryId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Updated user', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
        },
      },
      delete: {
        tags: ['Admin — Users'],
        summary: 'Delete a user permanently',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'User deleted', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
        },
      },
    },

    '/admin/users/{userId}/suspend': {
      post: {
        tags: ['Admin — Users'],
        summary: 'Suspend a user account',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { reason: { type: 'string', example: 'Violation of terms' } } },
            },
          },
        },
        responses: { 200: { description: 'User suspended' } },
      },
    },

    '/admin/users/{userId}/activate': {
      post: {
        tags: ['Admin — Users'],
        summary: 'Activate a suspended user account',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User activated' } },
      },
    },

    '/admin/users/{userId}/reset-runs': {
      post: {
        tags: ['Admin — Users'],
        summary: "Reset a user's AI run counter to 0",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Runs reset' } },
      },
    },

    '/admin/users/{userId}/change-plan': {
      post: {
        tags: ['Admin — Users'],
        summary: "Change a user's plan tier (admin override, no Stripe)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['planTier'],
                properties: { planTier: { $ref: '#/components/schemas/PlanTier' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Plan updated', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, user: { $ref: '#/components/schemas/User' } } } } } } },
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // ADMIN — TOOLS
    // ════════════════════════════════════════════════════════════════════════
    '/admin/tools': {
      get: {
        tags: ['Admin — Tools'],
        summary: 'List all tools',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Array of tools', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Tool' } } } } } },
      },
      post: {
        tags: ['Admin — Tools'],
        summary: 'Create a new AI tool',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'slug', 'industryId', 'systemPrompt'],
                properties: {
                  name: { type: 'string', example: 'Blog Post Writer' },
                  slug: { type: 'string', example: 'blog-post-writer' },
                  description: { type: 'string' },
                  icon: { type: 'string', example: '✍️' },
                  industryId: { type: 'string' },
                  systemPrompt: { type: 'string' },
                  userPromptTemplate: { type: 'string' },
                  fields: { type: 'array', items: { type: 'object' } },
                  planRequired: { $ref: '#/components/schemas/PlanTier' },
                  outputFormat: { type: 'string', enum: ['text', 'markdown', 'json'], default: 'markdown' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Tool created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Tool' } } } } },
      },
    },

    '/admin/tools/{toolId}': {
      get: {
        tags: ['Admin — Tools'],
        summary: 'Get tool details',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'toolId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Tool object', content: { 'application/json': { schema: { $ref: '#/components/schemas/Tool' } } } } },
      },
      patch: {
        tags: ['Admin — Tools'],
        summary: 'Update a tool',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'toolId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Tool' } } } },
        responses: { 200: { description: 'Updated tool', content: { 'application/json': { schema: { $ref: '#/components/schemas/Tool' } } } } },
      },
      delete: {
        tags: ['Admin — Tools'],
        summary: 'Delete a tool',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'toolId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Tool deleted' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // ADMIN — INDUSTRIES
    // ════════════════════════════════════════════════════════════════════════
    '/admin/industries': {
      get: {
        tags: ['Admin — Industries'],
        summary: 'List all industries',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Array of industries', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Industry' } } } } } },
      },
      post: {
        tags: ['Admin — Industries'],
        summary: 'Create a new industry',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'slug'],
                properties: {
                  name: { type: 'string', example: 'Healthcare' },
                  slug: { type: 'string', example: 'healthcare' },
                  icon: { type: 'string', example: '🏥' },
                  description: { type: 'string' },
                  color: { type: 'string', example: '#10b981' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Industry created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Industry' } } } } },
      },
    },

    '/admin/industries/{industryId}': {
      patch: {
        tags: ['Admin — Industries'],
        summary: 'Update an industry',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'industryId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Industry' } } } },
        responses: { 200: { description: 'Updated industry', content: { 'application/json': { schema: { $ref: '#/components/schemas/Industry' } } } } },
      },
      delete: {
        tags: ['Admin — Industries'],
        summary: 'Delete an industry',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'industryId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Industry deleted' } },
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // ADMIN — AI PROVIDERS
    // ════════════════════════════════════════════════════════════════════════
    '/admin/ai-providers': {
      get: {
        tags: ['Admin — AI Providers'],
        summary: 'List all AI providers',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Array of providers', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/AiProvider' } } } } } },
      },
      post: {
        tags: ['Admin — AI Providers'],
        summary: 'Add a new AI provider',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'slug', 'apiKey', 'defaultModel'],
                properties: {
                  name: { type: 'string', example: 'OpenAI' },
                  slug: { type: 'string', example: 'openai', enum: ['openai', 'anthropic', 'gemini', 'mistral', 'groq', 'custom'] },
                  apiKey: { type: 'string', example: 'sk-...' },
                  defaultModel: { type: 'string', example: 'gpt-4o' },
                  baseUrl: { type: 'string' },
                  isDefault: { type: 'boolean', default: false },
                  config: { type: 'object', properties: { maxTokens: { type: 'integer' }, temperature: { type: 'number' } } },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Provider created', content: { 'application/json': { schema: { $ref: '#/components/schemas/AiProvider' } } } } },
      },
    },

    '/admin/ai-providers/{providerId}': {
      patch: {
        tags: ['Admin — AI Providers'],
        summary: 'Update an AI provider',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'providerId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AiProvider' } } } },
        responses: { 200: { description: 'Updated provider' } },
      },
      delete: {
        tags: ['Admin — AI Providers'],
        summary: 'Delete an AI provider',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'providerId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Provider deleted' } },
      },
    },

    '/admin/ai-providers/{providerId}/test': {
      post: {
        tags: ['Admin — AI Providers'],
        summary: 'Test an AI provider connection',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'providerId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Test result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    text: { type: 'string' },
                    latencyMs: { type: 'integer' },
                  },
                },
              },
            },
          },
          500: { description: 'Connection failed' },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // ADMIN — BILLING
    // ════════════════════════════════════════════════════════════════════════
    '/admin/subscriptions': {
      get: {
        tags: ['Admin — Billing'],
        summary: 'List all users with subscription info',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'plan', in: 'query', schema: { $ref: '#/components/schemas/PlanTier' } },
          { name: 'status', in: 'query', schema: { $ref: '#/components/schemas/UserStatus' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 25 } },
        ],
        responses: {
          200: {
            description: 'Paginated subscriptions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    subscriptions: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/admin/invoices': {
      get: {
        tags: ['Admin — Billing'],
        summary: 'List all invoices with customer info',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by invoice number or customer name/email' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 25 } },
        ],
        responses: {
          200: {
            description: 'Paginated invoices',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    invoices: { type: 'array', items: { $ref: '#/components/schemas/Invoice' } },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // ADMIN — AUDIT
    // ════════════════════════════════════════════════════════════════════════
    '/admin/audit-logs': {
      get: {
        tags: ['Admin — Audit'],
        summary: 'Get platform-wide audit log',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 25 } },
        ],
        responses: {
          200: {
            description: 'Paginated audit logs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    logs: { type: 'array', items: { type: 'object' } },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerSpec;
