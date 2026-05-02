import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    size: { type: Number, default: 0 },
    mimeType: { type: String, default: 'text/plain' },
    status: { type: String, enum: ['processing', 'ready', 'failed'], default: 'processing' },
    chunkCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Document = mongoose.model('Document', documentSchema);
export default Document;
