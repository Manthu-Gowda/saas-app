import User from '../models/User.js';
import History from '../models/History.js';
import Industry from '../models/Industry.js';

export const getIndustries = async (req, res) => {
  try {
    const industries = await Industry.find({ status: 'active' });
    res.json(industries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recentHistory = await History.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('toolId', 'name icon');

    res.json({
      runsUsed: user.runsUsed,
      runsTotal: user.runsTotal,
      planTier: user.planTier,
      recentActivity: recentHistory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await History.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('toolId', 'name');
      
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setIndustry = async (req, res) => {
  try {
    const { industryId } = req.body;
    
    if (!industryId) {
      return res.status(400).json({ message: 'Industry ID is required' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.industryId = industryId;
      await user.save();
      
      res.json({
        message: 'Industry updated successfully',
        industryId: user.industryId
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
