import DocumentChunk from '../models/DocumentChunk.js';

// Split text into overlapping chunks of ~500 words
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

// Search user's document chunks using MongoDB full-text search
export const searchChunks = async (userId, query, limit = 5) => {
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
    // Fallback: return recent chunks if text index not ready
    return await DocumentChunk.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('documentId', 'name');
  }
};

// Build a context string from retrieved chunks to inject into AI prompt
export const buildContext = (chunks) => {
  if (!chunks.length) return '';
  return chunks
    .map((c, i) => `[Source ${i + 1}: ${c.documentId?.name || 'Document'}]\n${c.content}`)
    .join('\n\n---\n\n');
};

// Build the RAG system prompt wrapper
export const buildRagSystemPrompt = (basePrompt, context) => {
  return `${basePrompt}

You have access to the following relevant document excerpts to help answer the user's question. Use this context to provide accurate, grounded answers. If the context doesn't contain the answer, say so honestly.

CONTEXT:
${context}`;
};
