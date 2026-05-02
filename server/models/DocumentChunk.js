import mongoose from 'mongoose';

const documentChunkSchema = new mongoose.Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chunkIndex: { type: Number, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

documentChunkSchema.index({ content: 'text' });
documentChunkSchema.index({ userId: 1, documentId: 1 });

const DocumentChunk = mongoose.model('DocumentChunk', documentChunkSchema);
export default DocumentChunk;
