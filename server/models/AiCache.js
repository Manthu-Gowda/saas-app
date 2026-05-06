import mongoose from 'mongoose';

const aiCacheSchema = new mongoose.Schema(
  {
    cacheKey: { type: String, required: true, unique: true, index: true },
    toolId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool' },
    response: { type: String, required: true },
    tokensUsed: { type: Number, default: 0 },
    costUsd: { type: Number, default: 0 },
    hitCount: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true }
);

const AiCache = mongoose.model('AiCache', aiCacheSchema);
export default AiCache;
