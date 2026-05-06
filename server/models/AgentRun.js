import mongoose from 'mongoose';

const stepResultSchema = new mongoose.Schema({
  stepNumber: { type: Number },
  stepName: { type: String },
  outputVariable: { type: String },
  response: { type: String },
  tokensUsed: { type: Number, default: 0 },
  costUsd: { type: Number, default: 0 },
  costInr: { type: Number, default: 0 },
  latencyMs: { type: Number, default: 0 },
}, { _id: false });

const agentRunSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    inputs: { type: mongoose.Schema.Types.Mixed, default: {} },
    stepResults: [stepResultSchema],
    finalOutputs: { type: mongoose.Schema.Types.Mixed, default: {} },
    totalTokensUsed: { type: Number, default: 0 },
    totalCostUsd: { type: Number, default: 0 },
    totalCostInr: { type: Number, default: 0 },
    status: { type: String, enum: ['running', 'completed', 'failed'], default: 'running' },
    errorMessage: { type: String, default: '' },
  },
  { timestamps: true }
);

const AgentRun = mongoose.model('AgentRun', agentRunSchema);
export default AgentRun;
