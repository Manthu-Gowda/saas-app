import { createRequire } from 'module';
import Document from '../models/Document.js';
import DocumentChunk from '../models/DocumentChunk.js';
import AiProvider from '../models/AiProvider.js';
import User from '../models/User.js';
import { decrypt } from '../utils/encryption.js';
import { callAiProvider } from '../utils/aiProviders.js';
import {
  chunkText,
  generateEmbedding,
  generateEmbeddingsBatch,
  searchChunksSemantic,
  searchChunksKeyword,
  buildContext,
  buildRagSystemPrompt,
} from '../utils/ragUtils.js';
import { calculateCost } from '../utils/costCalculator.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// Get the OpenAI provider's decrypted API key (needed for embeddings)
const getOpenAiKey = async () => {
  const provider = await AiProvider.findOne({ slug: 'openai', isActive: true });
  return provider?.apiKeyEnc ? decrypt(provider.apiKeyEnc) : null;
};

// ── Upload & index a document ─────────────────────────────────────────────────
// INGEST pipeline: extract text → chunk → embed → store

export const uploadDocument = async (req, res) => {
  let doc = null;
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { description = '' } = req.body;
    const { originalname, buffer, mimetype, size } = req.file;

    // ── Step 1: Extract text ──────────────────────────────────────────────────
    let text = '';
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      text = data.text;
    } else {
      text = buffer.toString('utf-8');
    }
    if (!text.trim()) return res.status(400).json({ message: 'Could not extract text from file' });

    // ── Step 2: Create document record (processing state) ────────────────────
    doc = await Document.create({
      userId: req.user._id,
      name: originalname,
      description,
      size,
      mimeType: mimetype,
      status: 'processing',
    });

    // ── Step 3: Chunk text (500 words, 50-word overlap) ──────────────────────
    const chunks = chunkText(text);

    // ── Step 4: Generate embeddings (semantic vectors) ───────────────────────
    const openAiKey = await getOpenAiKey();
    let embeddings = null;
    if (openAiKey) {
      try {
        embeddings = await generateEmbeddingsBatch(chunks, openAiKey);
      } catch (embErr) {
        // Non-fatal: proceed without embeddings, fall back to keyword search
        console.warn('[RAG] Embedding generation failed, storing chunks without vectors:', embErr.message);
      }
    }

    // ── Step 5: Store chunks with embeddings ─────────────────────────────────
    const chunkDocs = chunks.map((content, idx) => ({
      documentId: doc._id,
      userId: req.user._id,
      chunkIndex: idx,
      content,
      ...(embeddings ? { embedding: embeddings[idx] } : {}),
    }));

    await DocumentChunk.insertMany(chunkDocs);

    const finalDoc = await Document.findByIdAndUpdate(
      doc._id,
      { status: 'ready', chunkCount: chunks.length },
      { new: true }
    );

    res.status(201).json({
      ...finalDoc.toObject(),
      embeddingEnabled: !!embeddings,
    });
  } catch (error) {
    // Roll back document record if it was created
    if (doc?._id) {
      await Document.findByIdAndDelete(doc._id).catch(() => {});
      await DocumentChunk.deleteMany({ documentId: doc._id }).catch(() => {});
    }
    res.status(500).json({ message: error.message });
  }
};

// ── List user's documents ─────────────────────────────────────────────────────

export const listDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user._id, status: 'ready' }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Delete a document and its chunks ─────────────────────────────────────────

export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.docId, userId: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    await DocumentChunk.deleteMany({ documentId: doc._id });
    await Document.findByIdAndDelete(doc._id);

    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Query documents (RAG) ─────────────────────────────────────────────────────
// QUERY pipeline: embed query → similarity search → build context → LLM answer

export const queryDocuments = async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;
    if (!query?.trim()) return res.status(400).json({ message: 'Query is required' });

    const user = await User.findById(req.user._id);
    // runsTotal === -1 means unlimited (BUSINESS plan)
    if (user.runsTotal !== -1) {
      const totalAvailable = user.runsTotal + (user.bonusRuns || 0);
      if (user.runsUsed >= totalAvailable) {
        return res.status(403).json({ message: 'AI run limit exceeded. Please upgrade your plan.' });
      }
    }

    // ── Step 1: Embed the query (same model as document chunks) ──────────────
    const openAiKey = await getOpenAiKey();
    let chunks = [];
    let searchMode = 'keyword';

    if (openAiKey) {
      try {
        const queryEmbedding = await generateEmbedding(query, openAiKey);
        chunks = await searchChunksSemantic(req.user._id, queryEmbedding, Number(topK));
        searchMode = 'semantic';
      } catch {
        // Embedding failed — fall back to keyword search
      }
    }

    // ── Step 2: Fallback to keyword search if no embeddings available ────────
    if (!chunks.length) {
      chunks = await searchChunksKeyword(req.user._id, query, Number(topK));
    }

    if (!chunks.length) {
      return res.json({
        answer: 'No relevant documents found. Please upload documents first.',
        sources: [],
        searchMode,
        tokensUsed: 0,
        costUsd: 0,
        costInr: 0,
      });
    }

    // ── Step 3: Build context from top-K chunks ──────────────────────────────
    const context = buildContext(chunks);

    // ── Step 4: Call LLM with context-augmented prompt ───────────────────────
    const provider = await AiProvider.findOne({ isDefault: true, isActive: true });
    if (!provider?.apiKeyEnc) {
      return res.status(503).json({ message: 'No AI provider configured. Please add one in Admin → AI Providers.' });
    }

    const apiKey = decrypt(provider.apiKeyEnc);
    const systemPrompt = buildRagSystemPrompt(
      'You are a helpful document assistant. Answer questions accurately based on provided document context.',
      context
    );

    const result = await callAiProvider({ provider, apiKey, userPrompt: query, config: { systemPrompt } });

    const cost = calculateCost({
      providerSlug: provider.slug,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      customPricing: provider.pricing?.inputPer1M ? provider.pricing : null,
    });

    user.runsUsed += 1;
    await user.save();

    // ── Step 5: Return answer + sources + metadata ───────────────────────────
    res.json({
      answer: result.text,
      sources: chunks.map((c) => ({
        documentName: c.documentId?.name || c._doc?.documentId?.name || 'Unknown',
        excerpt: c.content.slice(0, 200) + '...',
        similarityScore: c.similarityScore ? Math.round(c.similarityScore * 100) / 100 : undefined,
      })),
      searchMode,         // 'semantic' | 'keyword'
      tokensUsed: result.inputTokens + result.outputTokens,
      costUsd: cost.costUsd,
      costInr: cost.costInr,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
