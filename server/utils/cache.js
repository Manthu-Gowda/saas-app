import { createHash } from 'crypto';
import AiCache from '../models/AiCache.js';

export const getCacheKey = (toolSlug, inputs) => {
  const sorted = Object.fromEntries(
    Object.entries(inputs || {}).sort(([a], [b]) => a.localeCompare(b))
  );
  return createHash('md5').update(JSON.stringify({ toolSlug, inputs: sorted })).digest('hex');
};

export const getFromCache = async (cacheKey) => {
  const cached = await AiCache.findOne({ cacheKey, expiresAt: { $gt: new Date() } });
  if (!cached) return null;
  await AiCache.updateOne({ _id: cached._id }, { $inc: { hitCount: 1 } });
  return cached;
};

export const saveToCache = async ({ cacheKey, toolId, response, tokensUsed, costUsd }) => {
  const ttlHours = Number(process.env.CACHE_TTL_HOURS) || 24;
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
  await AiCache.findOneAndUpdate(
    { cacheKey },
    { cacheKey, toolId, response, tokensUsed, costUsd, expiresAt, hitCount: 0 },
    { upsert: true }
  );
};

export const getCacheStats = async () => {
  const total = await AiCache.countDocuments();
  const totalHits = await AiCache.aggregate([{ $group: { _id: null, hits: { $sum: '$hitCount' }, saved: { $sum: { $multiply: ['$hitCount', '$costUsd'] } } } }]);
  return {
    cachedResponses: total,
    totalCacheHits: totalHits[0]?.hits || 0,
    totalCostSavedUsd: Math.round((totalHits[0]?.saved || 0) * 10000) / 10000,
  };
};
