import User from '../models/User.js';
import Tool from '../models/Tool.js';
import Industry from '../models/Industry.js';
import AiProvider from '../models/AiProvider.js';
import AuditLog from '../models/AuditLog.js';
import History from '../models/History.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import { callAiProvider } from '../utils/aiProviders.js';

// ── Dashboard Stats ────────────────────────────────────────────────────────────

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'CUSTOMER' });
    const activeUsers = await User.countDocuments({ role: 'CUSTOMER', status: 'active' });
    const suspendedUsers = await User.countDocuments({ role: 'CUSTOMER', status: 'suspended' });

    const planCounts = await User.aggregate([
      { $match: { role: 'CUSTOMER' } },
      { $group: { _id: '$planTier', count: { $sum: 1 } } },
    ]);

    const totalAiRuns = await History.countDocuments();
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const aiRunsToday = await History.countDocuments({ createdAt: { $gte: todayStart } });

    const topTools = await History.aggregate([
      { $group: { _id: '$toolId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'tools', localField: '_id', foreignField: '_id', as: 'tool' } },
      { $unwind: '$tool' },
      { $project: { name: '$tool.name', count: 1 } },
    ]);

    // Last 7 days signup trend
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const signupTrend = await User.aggregate([
      { $match: { role: 'CUSTOMER', createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalUsers, activeUsers, suspendedUsers,
      planCounts, totalAiRuns, aiRunsToday,
      topTools, signupTrend,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Users ──────────────────────────────────────────────────────────────────────

export const getAllUsers = async (req, res) => {
  try {
    const { search = '', status, plan, page = 1, limit = 25 } = req.query;
    const query = { role: 'CUSTOMER' };
    if (status) query.status = status;
    if (plan) query.planTier = plan;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .populate('industryId', 'name icon')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ users, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('industryId', 'name icon slug');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const recentHistory = await History.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('toolId', 'name');

    const auditLogs = await AuditLog.find({ targetId: user._id.toString() })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('userId', 'name email');

    res.json({ user, recentHistory, auditLogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, status, industryId, planTier, runsTotal } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, status, industryId, planTier, runsTotal },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    await AuditLog.create({
      userId: req.user._id,
      action: 'UPDATE_USER',
      targetType: 'User',
      targetId: user._id.toString(),
      metadata: req.body,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const suspendUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'suspended' },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    await AuditLog.create({
      userId: req.user._id,
      action: 'SUSPEND_USER',
      targetType: 'User',
      targetId: user._id.toString(),
      metadata: { reason },
    });

    res.json({ message: 'User suspended', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'active' },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    await AuditLog.create({
      userId: req.user._id,
      action: 'ACTIVATE_USER',
      targetType: 'User',
      targetId: user._id.toString(),
      metadata: {},
    });

    res.json({ message: 'User activated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetUserRuns = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { runsUsed: 0, lastRunResetAt: new Date() },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    await AuditLog.create({
      userId: req.user._id,
      action: 'RESET_USER_RUNS',
      targetType: 'User',
      targetId: user._id.toString(),
      metadata: {},
    });

    res.json({ message: 'Runs reset', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePlan = async (req, res) => {
  try {
    const { planTier } = req.body;
    const planRunsMap = { FREE: 10, STARTER: 100, PRO: 500, BUSINESS: -1 };
    const runsTotal = planRunsMap[planTier] ?? 10;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { planTier, runsTotal },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    await AuditLog.create({
      userId: req.user._id,
      action: 'CHANGE_PLAN',
      targetType: 'User',
      targetId: user._id.toString(),
      metadata: { planTier },
    });

    res.json({ message: 'Plan updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Industries ─────────────────────────────────────────────────────────────────

export const getAllIndustries = async (req, res) => {
  try {
    const industries = await Industry.find({}).sort({ sortOrder: 1 });
    res.json(industries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createIndustry = async (req, res) => {
  try {
    const industry = await Industry.create(req.body);
    res.status(201).json(industry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateIndustry = async (req, res) => {
  try {
    const industry = await Industry.findByIdAndUpdate(req.params.industryId, req.body, { new: true });
    if (!industry) return res.status(404).json({ message: 'Industry not found' });
    res.json(industry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteIndustry = async (req, res) => {
  try {
    await Industry.findByIdAndDelete(req.params.industryId);
    res.json({ message: 'Industry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── AI Providers ───────────────────────────────────────────────────────────────

export const getAllProviders = async (req, res) => {
  try {
    const providers = await AiProvider.find({}).sort({ createdAt: 1 });
    // Never expose the encrypted API key
    const safe = providers.map((p) => ({
      _id: p._id,
      name: p.name,
      slug: p.slug,
      baseUrl: p.baseUrl,
      defaultModel: p.defaultModel,
      isActive: p.isActive,
      isDefault: p.isDefault,
      config: p.config,
      hasApiKey: Boolean(p.apiKeyEnc),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
    res.json(safe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProvider = async (req, res) => {
  try {
    const { name, slug, baseUrl, apiKey, defaultModel, isDefault, config } = req.body;
    const apiKeyEnc = apiKey ? encrypt(apiKey) : '';

    if (isDefault) await AiProvider.updateMany({}, { isDefault: false });

    const provider = await AiProvider.create({
      name, slug, baseUrl, apiKeyEnc, defaultModel, isDefault: Boolean(isDefault), config,
    });

    res.status(201).json({ ...provider.toObject(), apiKeyEnc: undefined, hasApiKey: Boolean(apiKeyEnc) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProvider = async (req, res) => {
  try {
    const { name, slug, baseUrl, apiKey, defaultModel, isActive, isDefault, config } = req.body;
    const updateData = { name, slug, baseUrl, defaultModel, isActive, isDefault, config };

    if (apiKey) updateData.apiKeyEnc = encrypt(apiKey);
    if (isDefault) await AiProvider.updateMany({ _id: { $ne: req.params.providerId } }, { isDefault: false });

    const provider = await AiProvider.findByIdAndUpdate(req.params.providerId, updateData, { new: true });
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    res.json({ ...provider.toObject(), apiKeyEnc: undefined, hasApiKey: Boolean(provider.apiKeyEnc) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProvider = async (req, res) => {
  try {
    await AiProvider.findByIdAndDelete(req.params.providerId);
    res.json({ message: 'Provider deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const testProvider = async (req, res) => {
  try {
    const provider = await AiProvider.findById(req.params.providerId);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    if (!provider.apiKeyEnc) return res.status(400).json({ message: 'No API key configured' });

    const apiKey = decrypt(provider.apiKeyEnc);
    const start = Date.now();

    const result = await callAiProvider({
      provider,
      apiKey,
      userPrompt: 'Say exactly: "Zynapse AI Provider connection successful!"',
      config: { systemPrompt: 'You are a helpful assistant.' },
    });

    res.json({ success: true, text: result.text, latencyMs: Date.now() - start });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Analytics ──────────────────────────────────────────────────────────────────

export const getAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const dailyRuns = await History.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          runs: { $sum: 1 },
          tokens: { $sum: '$tokensUsed' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const toolUsage = await History.aggregate([
      { $group: { _id: '$toolId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'tools', localField: '_id', foreignField: '_id', as: 'tool' } },
      { $unwind: '$tool' },
      {
        $lookup: {
          from: 'industries',
          localField: 'tool.industryId',
          foreignField: '_id',
          as: 'industry',
        },
      },
      { $unwind: { path: '$industry', preserveNullAndEmpty: true } },
      { $project: { name: '$tool.name', industry: '$industry.name', count: 1 } },
    ]);

    const industryUsage = await History.aggregate([
      {
        $lookup: {
          from: 'tools',
          localField: 'toolId',
          foreignField: '_id',
          as: 'tool',
        },
      },
      { $unwind: '$tool' },
      {
        $lookup: {
          from: 'industries',
          localField: 'tool.industryId',
          foreignField: '_id',
          as: 'industry',
        },
      },
      { $unwind: '$industry' },
      { $group: { _id: '$industry.name', count: { $sum: 1 } } },
    ]);

    const planBreakdown = await User.aggregate([
      { $match: { role: 'CUSTOMER' } },
      { $group: { _id: '$planTier', count: { $sum: 1 } } },
    ]);

    const userGrowth = await User.aggregate([
      { $match: { role: 'CUSTOMER', createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const providerUsage = await History.aggregate([
      { $group: { _id: '$provider', count: { $sum: 1 } } },
    ]);

    res.json({ dailyRuns, toolUsage, industryUsage, planBreakdown, userGrowth, providerUsage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Audit Logs ─────────────────────────────────────────────────────────────────

export const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 25 } = req.query;
    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    res.json({ logs, total, page: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Subscriptions Overview ─────────────────────────────────────────────────────

export const getSubscriptionsOverview = async (req, res) => {
  try {
    const { page = 1, limit = 25, plan, status } = req.query;
    const query = { role: 'CUSTOMER' };
    if (plan) query.planTier = plan;
    if (status) query.status = status;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .populate('industryId', 'name')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ subscriptions: users, total, page: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
