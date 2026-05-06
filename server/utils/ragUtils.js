import DocumentChunk from '../models/DocumentChunk.js';

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
// text-embedding-3-small: 1536 dimensions, $0.02/1M tokens
// text-embedding-3-large: 3072 dimensions, $0.13/1M tokens

// ── Text chunking ────────────────────────────────────────────────────────────
// 500 words ≈ 375 tokens — well within 8191-token embedding limit

export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  let i = 0;
  while (i < words.length) {
    const end = Math.min(i + chunkSize, words.length);
    chunks.push(words.slice(i, end).join(' '));
    i += chunkSize - overlap;
    if (i >= words.length) break;
  }
  return chunks;
};

// ── OpenAI Embeddings API ────────────────────────────────────────────────────

const OPENAI_EMBED_URL = 'https://api.openai.com/v1/embeddings';

export const generateEmbedding = async (text, apiKey) => {
  const res = await fetch(OPENAI_EMBED_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text.slice(0, 32000) }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Embedding API error ${res.status}`);
  }
  const data = await res.json();
  return data.data[0].embedding; // float[] of length 1536
};

// Batch up to 100 texts per API call (OpenAI max is 2048, we stay conservative)
export const generateEmbeddingsBatch = async (texts, apiKey) => {
  const BATCH = 100;
  const all = [];
  for (let i = 0; i < texts.length; i += BATCH) {
    const slice = texts.slice(i, i + BATCH).map((t) => t.slice(0, 32000));
    const res = await fetch(OPENAI_EMBED_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: EMBEDDING_MODEL, input: slice }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Embedding batch error ${res.status}`);
    }
    const data = await res.json();
    // API returns results in the same order, but sort by index to be safe
    data.data.sort((a, b) => a.index - b.index);
    all.push(...data.data.map((d) => d.embedding));
  }
  return all; // float[][] — one embedding per input text
};

// ── Cosine similarity ────────────────────────────────────────────────────────

export const cosineSimilarity = (a, b) => {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot  += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
};

// ── Semantic search (vector similarity) ─────────────────────────────────────
// Returns top-K chunks sorted by cosine similarity to queryEmbedding

export const searchChunksSemantic = async (userId, queryEmbedding, limit = 5) => {
  // Only load chunks that actually have embeddings stored
  const chunks = await DocumentChunk.find(
    { userId, 'embedding.0': { $exists: true } }
  ).populate('documentId', 'name');

  if (!chunks.length) return [];

  const scored = chunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => ({ ...s.chunk.toObject(), _doc: s.chunk, similarityScore: s.score }));
};

// ── Keyword fallback (when no OpenAI provider configured) ────────────────────

export const searchChunksKeyword = async (userId, query, limit = 5) => {
  try {
    const results = await DocumentChunk.find(
      { userId, $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .populate('documentId', 'name');
    return results;
  } catch {
    return await DocumentChunk.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('documentId', 'name');
  }
};

// ── Context builder ──────────────────────────────────────────────────────────

export const buildContext = (chunks) =>
  chunks
    .map((c, i) => {
      const name = c.documentId?.name || c._doc?.documentId?.name || 'Document';
      return `[Source ${i + 1}: ${name}]\n${c.content}`;
    })
    .join('\n\n---\n\n');

export const buildRagSystemPrompt = (basePrompt, context) => `${basePrompt}

You have access to the following relevant document excerpts to answer the user's question. Use this context to give accurate, grounded answers. If the context doesn't contain the answer, say so honestly.

CONTEXT:
${context}`;
