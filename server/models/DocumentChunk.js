import mongoose from 'mongoose';

const documentChunkSchema = new mongoose.Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chunkIndex: { type: Number, required: true },
    content:    { type: String, required: true },
    embedding:  { type: [Number], default: [] },
  },
  { timestamps: true }
);

// Keep text index as keyword fallback when no OpenAI provider is configured
documentChunkSchema.index({ content: 'text' });
documentChunkSchema.index({ userId: 1, documentId: 1 });
// Partial index so the embedding query stays fast
documentChunkSchema.index({ userId: 1 }, { partialFilterExpression: { 'embedding.0': { $exists: true } } });

const DocumentChunk = mongoose.model('DocumentChunk', documentChunkSchema);
export default DocumentChunk;
