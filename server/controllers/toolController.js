import Tool from '../models/Tool.js';
import History from '../models/History.js';
import User from '../models/User.js';
import AiProvider from '../models/AiProvider.js';
import { decrypt } from '../utils/encryption.js';
import { callAiProvider } from '../utils/aiProviders.js';
import { calculateCost } from '../utils/costCalculator.js';
import { getCacheKey, getFromCache, saveToCache } from '../utils/cache.js';

export const getToolsByIndustry = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.industryId) return res.json([]);
    const tools = await Tool.find({ industryId: user.industryId, status: 'active' })
      .populate('industryId', 'name slug icon')
      .sort({ sortOrder: 1 })
      .select('-systemPrompt -userPromptTemplate');
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getToolBySlug = async (req, res) => {
  try {
    const tool = await Tool.findOne({ slug: req.params.slug, status: 'active' });
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const runTool = async (req, res) => {
  try {
    const { toolSlug, promptData } = req.body;
    const user = await User.findById(req.user._id);

    const totalAvailable = user.runsTotal + (user.bonusRuns || 0);
    if (user.runsUsed >= totalAvailable) {
      return res.status(403).json({ message: 'AI run limit exceeded. Please upgrade your plan.' });
    }

    const tool = await Tool.findOne({ slug: toolSlug, status: 'active' }).populate('aiProviderId');
    if (!tool) return res.status(404).json({ message: 'Tool not found' });

    // ── Cache check ──────────────────────────────────────────────────────────
    const cacheEnabled = process.env.CACHE_ENABLED !== 'false';
    const cacheKey = getCacheKey(toolSlug, promptData);

    if (cacheEnabled) {
      const cached = await getFromCache(cacheKey);
      if (cached) {
        await History.create({
          userId: user._id,
          toolId: tool._id,
          prompt: JSON.stringify(promptData),
          response: cached.response,
          provider: 'cache',
          tokensUsed: 0,
          costUsd: 0,
          costInr: 0,
          cacheHit: true,
          latencyMs: 0,
          status: 'completed',
        });
        user.runsUsed += 1;
        await user.save();
        return res.json({
          response: cached.response,
          runsUsed: user.runsUsed,
          runsTotal: totalAvailable,
          tokensUsed: 0,
          costUsd: 0,
          costInr: 0,
          cacheHit: true,
        });
      }
    }

    // ── Provider resolution ──────────────────────────────────────────────────
    let provider = tool.aiProviderId;
    if (!provider) {
      provider = await AiProvider.findOne({ isDefault: true, isActive: true });
    }

    let responseText = '';
    let inputTokens = 0;
    let outputTokens = 0;
    let costUsd = 0;
    let costInr = 0;
    const startTime = Date.now();

    if (provider && provider.apiKeyEnc) {
      try {
        const apiKey = decrypt(provider.apiKeyEnc);

        let userPrompt = tool.userPromptTemplate || '';
        if (promptData && typeof promptData === 'object') {
          Object.entries(promptData).forEach(([key, value]) => {
            userPrompt = userPrompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value || '');
          });
        }

        if (!userPrompt.trim() || userPrompt === tool.userPromptTemplate) {
          let fallback = `${tool.name} request:\n\n`;
          tool.fields.forEach((f) => {
            if (f.type !== 'file' && promptData?.[f.name]) {
              fallback += `${f.label}: ${promptData[f.name]}\n`;
            }
          });
          userPrompt = fallback;
        }

        const result = await callAiProvider({
          provider,
          apiKey,
          userPrompt,
          config: { systemPrompt: tool.systemPrompt },
        });

        responseText = result.text;
        inputTokens = result.inputTokens;
        outputTokens = result.outputTokens;

        // ── Cost calculation ───────────────────────────────────────────────
        const cost = calculateCost({
          providerSlug: provider.slug,
          inputTokens,
          outputTokens,
          customPricing: provider.pricing?.inputPer1M ? provider.pricing : null,
        });
        costUsd = cost.costUsd;
        costInr = cost.costInr;

        // ── Save to cache ──────────────────────────────────────────────────
        if (cacheEnabled) {
          await saveToCache({ cacheKey, toolId: tool._id, response: responseText, tokensUsed: inputTokens + outputTokens, costUsd });
        }
      } catch (aiError) {
        return res.status(500).json({ message: `AI Provider error: ${aiError.message}` });
      }
    } else {
      responseText = `**Demo Response for ${tool.name}**\n\nNo AI provider is configured yet. Please ask your administrator to add an AI provider in the Admin Portal → AI Providers.\n\n---\n\n**Your submitted data:**\n${
        tool.fields
          .filter((f) => f.type !== 'file')
          .map((f) => `- **${f.label}:** ${promptData?.[f.name] || '_empty_'}`)
          .join('\n')
      }`;
    }

    const latencyMs = Date.now() - startTime;

    await History.create({
      userId: user._id,
      toolId: tool._id,
      prompt: JSON.stringify(promptData),
      response: responseText,
      provider: provider?.name || 'Demo',
      tokensUsed: inputTokens + outputTokens,
      costUsd,
      costInr,
      cacheHit: false,
      latencyMs,
      status: 'completed',
    });

    user.runsUsed += 1;
    await user.save();

    res.json({
      response: responseText,
      runsUsed: user.runsUsed,
      runsTotal: totalAvailable,
      tokensUsed: inputTokens + outputTokens,
      costUsd,
      costInr,
      cacheHit: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllToolsAdmin = async (req, res) => {
  try {
    const tools = await Tool.find({})
      .populate('industryId', 'name slug icon')
      .populate('aiProviderId', 'name slug')
      .sort({ sortOrder: 1 });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getToolByIdAdmin = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.toolId)
      .populate('industryId', 'name slug icon')
      .populate('aiProviderId', 'name slug');
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTool = async (req, res) => {
  try {
    const tool = await Tool.create(req.body);
    res.status(201).json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.toolId, req.body, { new: true });
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTool = async (req, res) => {
  try {
    await Tool.findByIdAndDelete(req.params.toolId);
    res.json({ message: 'Tool deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
