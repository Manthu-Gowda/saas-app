import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    res.json({
      totalUsers,
      activeSubs: "...",
      mrr: "...",
      aiRuns: "...",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
