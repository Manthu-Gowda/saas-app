import Tool from '../models/Tool.js';
import History from '../models/History.js';
import User from '../models/User.js';

export const getToolsByIndustry = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.industryId) {
       return res.json([]); // No tools if no industry selected
    }

    const tools = await Tool.find({ industryId: user.industryId, status: 'active' });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getToolBySlug = async (req, res) => {
  try {
    const tool = await Tool.findOne({ slug: req.params.slug });
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const runTool = async (req, res) => {
  try {
    const { toolSlug, promptData } = req.body;
    const user = await User.findById(req.user._id);

    if (user.runsUsed >= user.runsTotal) {
      return res.status(403).json({ message: 'AI Run limit exceeded. Please upgrade your plan.' });
    }

    const tool = await Tool.findOne({ slug: toolSlug });
    if (!tool) return res.status(404).json({ message: 'Tool not found' });

    // TODO: Here is where we would call OpenAI/Anthropic SDKs based on tool.provider
    // For now, return a mock response
    const mockResponse = `This is a mock AI response from the backend for ${tool.name}. Your prompt parameters were received.`;

    // Save history
    await History.create({
      userId: user._id,
      toolId: tool._id,
      prompt: JSON.stringify(promptData),
      response: mockResponse,
      provider: tool.provider,
    });

    // Deduct run
    user.runsUsed += 1;
    await user.save();

    res.json({ response: mockResponse, runsUsed: user.runsUsed, runsTotal: user.runsTotal });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
