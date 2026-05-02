import Agent from '../models/Agent.js';
import AgentRun from '../models/AgentRun.js';
import AiProvider from '../models/AiProvider.js';
import User from '../models/User.js';
import { decrypt } from '../utils/encryption.js';
import { callAiProvider } from '../utils/aiProviders.js';
import { calculateCost } from '../utils/costCalculator.js';

// ── Customer: list available agents ──────────────────────────────────────────

export const getAgents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const query = { status: 'active', $or: [{ industryId: null }, { industryId: user.industryId }] };
    const agents = await Agent.find(query).populate('industryId', 'name icon').sort({ sortOrder: 1 });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Customer: get single agent ────────────────────────────────────────────────

export const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.agentId).populate('industryId', 'name icon');
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Customer: run an agent ────────────────────────────────────────────────────

export const runAgent = async (req, res) => {
  try {
    const { agentId, inputs } = req.body;

    const user = await User.findById(req.user._id);
    const totalAvailable = user.runsTotal + (user.bonusRuns || 0);
    if (user.runsUsed >= totalAvailable) {
      return res.status(403).json({ message: 'AI run limit exceeded. Please upgrade your plan.' });
    }

    const agent = await Agent.findById(agentId);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    const agentRun = await AgentRun.create({ userId: user._id, agentId, inputs, status: 'running' });

    const context = { ...inputs };
    const stepResults = [];
    let totalTokensUsed = 0;
    let totalCostUsd = 0;
    let totalCostInr = 0;

    for (const step of agent.steps.sort((a, b) => a.stepNumber - b.stepNumber)) {
      // Resolve provider for this step
      let provider = step.aiProviderId
        ? await AiProvider.findById(step.aiProviderId)
        : await AiProvider.findOne({ isDefault: true, isActive: true });

      if (!provider || !provider.apiKeyEnc) {
        await AgentRun.findByIdAndUpdate(agentRun._id, {
          status: 'failed',
          errorMessage: `Step ${step.stepNumber}: No AI provider configured`,
        });
        return res.status(503).json({ message: 'No AI provider configured for this agent step.' });
      }

      // Build prompt — replace {variable} with context values
      let userPrompt = step.userPromptTemplate;
      Object.entries(context).forEach(([key, value]) => {
        userPrompt = userPrompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value || '');
      });

      const startTime = Date.now();
      let result;
      try {
        const apiKey = decrypt(provider.apiKeyEnc);
        result = await callAiProvider({
          provider,
          apiKey,
          userPrompt,
          config: { systemPrompt: step.systemPrompt },
        });
      } catch (err) {
        await AgentRun.findByIdAndUpdate(agentRun._id, {
          status: 'failed',
          errorMessage: `Step ${step.stepNumber} (${step.name}): ${err.message}`,
        });
        return res.status(500).json({ message: `Step "${step.name}" failed: ${err.message}` });
      }

      const cost = calculateCost({
        providerSlug: provider.slug,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        customPricing: provider.pricing?.inputPer1M ? provider.pricing : null,
      });

      context[step.outputVariable] = result.text;
      totalTokensUsed += result.inputTokens + result.outputTokens;
      totalCostUsd += cost.costUsd;
      totalCostInr += cost.costInr;

      stepResults.push({
        stepNumber: step.stepNumber,
        stepName: step.name,
        outputVariable: step.outputVariable,
        response: result.text,
        tokensUsed: result.inputTokens + result.outputTokens,
        costUsd: cost.costUsd,
        costInr: cost.costInr,
        latencyMs: Date.now() - startTime,
      });
    }

    // Save final results
    const finalOutputs = {};
    agent.steps.forEach((s) => { finalOutputs[s.outputVariable] = context[s.outputVariable]; });

    await AgentRun.findByIdAndUpdate(agentRun._id, {
      stepResults,
      finalOutputs,
      totalTokensUsed,
      totalCostUsd: Math.round(totalCostUsd * 100000) / 100000,
      totalCostInr: Math.round(totalCostInr * 100) / 100,
      status: 'completed',
    });

    user.runsUsed += 1;
    await user.save();

    res.json({
      runId: agentRun._id,
      stepResults,
      finalOutputs,
      totalTokensUsed,
      totalCostUsd: Math.round(totalCostUsd * 100000) / 100000,
      totalCostInr: Math.round(totalCostInr * 100) / 100,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Customer: get agent run history ──────────────────────────────────────────

export const getAgentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await AgentRun.countDocuments({ userId: req.user._id });
    const runs = await AgentRun.find({ userId: req.user._id })
      .populate('agentId', 'name icon')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    res.json({ runs, total, page: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: list all agents ────────────────────────────────────────────────────

export const getAllAgentsAdmin = async (req, res) => {
  try {
    const agents = await Agent.find({}).populate('industryId', 'name icon').sort({ sortOrder: 1 });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: create agent ───────────────────────────────────────────────────────

export const createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: update agent ───────────────────────────────────────────────────────

export const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.agentId, req.body, { new: true });
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: delete agent ───────────────────────────────────────────────────────

export const deleteAgent = async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.agentId);
    res.json({ message: 'Agent deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
