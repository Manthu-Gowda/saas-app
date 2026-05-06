import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toolId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
    prompt: { type: String, required: true },
    response: { type: String },
    status: { type: String, enum: ['completed', 'failed', 'processing'], default: 'completed' },
    provider: { type: String },
    tokensUsed: { type: Number, default: 0 },
    costUsd: { type: Number, default: 0 },
    costInr: { type: Number, default: 0 },
    cacheHit: { type: Boolean, default: false },
    latencyMs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const History = mongoose.model('History', historySchema);
export default History;
