import User from '../models/User.js';
import History from '../models/History.js';
import Industry from '../models/Industry.js';

export const getIndustries = async (req, res) => {
  try {
    const industries = await Industry.find({ status: 'active' }).sort({ sortOrder: 1 });
    res.json(industries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('industryId', 'name icon');
    const recentHistory = await History.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('toolId', 'name icon');

    const totalAvailable = user.runsTotal + (user.bonusRuns || 0);
    res.json({
      runsUsed: user.runsUsed,
      runsTotal: totalAvailable,
      planTier: user.planTier,
      industry: user.industryId,
      recentActivity: recentHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await History.countDocuments({ userId: req.user._id });
    const history = await History.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('toolId', 'name icon');

    res.json({ history, total, page: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setIndustry = async (req, res) => {
  try {
    const { industryId } = req.body;
    if (!industryId) return res.status(400).json({ message: 'Industry ID is required' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { industryId },
      { new: true }
    ).populate('industryId', 'name icon');

    res.json({ message: 'Industry updated', industryId: user.industryId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('industryId', 'name icon slug');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true }
    ).select('-password');

    // Update session-friendly response
    sessionStorage; // no-op on server; client updates sessionStorage
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const match = await user.matchPassword(currentPassword);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
