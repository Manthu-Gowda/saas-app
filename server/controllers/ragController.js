import { createRequire } from 'module';
import Document from '../models/Document.js';
import DocumentChunk from '../models/DocumentChunk.js';
import AiProvider from '../models/AiProvider.js';
import User from '../models/User.js';
import { decrypt } from '../utils/encryption.js';
import { callAiProvider } from '../utils/aiProviders.js';
import { chunkText, searchChunks, buildContext, buildRagSystemPrompt } from '../utils/ragUtils.js';
import { calculateCost } from '../utils/costCalculator.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// ── Upload & index a document ─────────────────────────────────────────────────

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { description = '' } = req.body;
    const { originalname, buffer, mimetype, size } = req.file;

    let text = '';
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      text = data.text;
    } else {
      text = buffer.toString('utf-8');
    }

    if (!text.trim()) return res.status(400).json({ message: 'Could not extract text from file' });

    const doc = await Document.create({
      userId: req.user._id,
      name: originalname,
      description,
      size,
      mimeType: mimetype,
      status: 'processing',
    });

    const chunks = chunkText(text);
    const chunkDocs = chunks.map((content, idx) => ({
      documentId: doc._id,
      userId: req.user._id,
      chunkIndex: idx,
      content,
    }));

    await DocumentChunk.insertMany(chunkDocs);
    await Document.findByIdAndUpdate(doc._id, { status: 'ready', chunkCount: chunks.length });

    res.status(201).json({ ...doc.toObject(), status: 'ready', chunkCount: chunks.length });
  } catch (error) {
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

export const queryDocuments = async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;
    if (!query?.trim()) return res.status(400).json({ message: 'Query is required' });

    const user = await User.findById(req.user._id);
    const totalAvailable = user.runsTotal + (user.bonusRuns || 0);
    if (user.runsUsed >= totalAvailable) {
      return res.status(403).json({ message: 'AI run limit exceeded. Please upgrade your plan.' });
    }

    // Retrieve relevant chunks
    const chunks = await searchChunks(req.user._id, query, Number(topK));
    if (!chunks.length) {
      return res.json({
        answer: 'No relevant documents found. Please upload documents first.',
        sources: [],
        tokensUsed: 0,
        costUsd: 0,
        costInr: 0,
      });
    }

    const context = buildContext(chunks);

    // Get default AI provider
    const provider = await AiProvider.findOne({ isDefault: true, isActive: true });
    if (!provider || !provider.apiKeyEnc) {
      return res.status(503).json({ message: 'No AI provider configured. Please add one in Admin → AI Providers.' });
    }

    const apiKey = decrypt(provider.apiKeyEnc);
    const systemPrompt = buildRagSystemPrompt(
      'You are a helpful document assistant. Answer questions accurately based on provided document context.',
      context
    );

    const result = await callAiProvider({
      provider,
      apiKey,
      userPrompt: query,
      config: { systemPrompt },
    });

    const cost = calculateCost({
      providerSlug: provider.slug,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      customPricing: provider.pricing?.inputPer1M ? provider.pricing : null,
    });

    user.runsUsed += 1;
    await user.save();

    res.json({
      answer: result.text,
      sources: chunks.map((c) => ({ documentName: c.documentId?.name || 'Unknown', excerpt: c.content.slice(0, 200) + '...' })),
      tokensUsed: result.inputTokens + result.outputTokens,
      costUsd: cost.costUsd,
      costInr: cost.costInr,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
